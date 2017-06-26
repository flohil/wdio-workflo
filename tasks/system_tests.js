'use strict'

const gulp        = require('gulp'),
  runSequence     = require('run-sequence'),
  gutil           = require('gulp-util'),
  tcpPortUsed     = require('tcp-port-used'),
  config          = require('../../config'),
  selenium        = require('selenium-standalone'),
  env_config      = require('../../env_config'),
  shell           = require('gulp-shell'),
  webserver       = require('gulp-webserver')

const port = config.browserSync.port
let webserver_stream = undefined

function makeParams() {
  let params = ''

  // skip first 3 params, which are node location, gulp location, gulp task
  for (let i = 3; i < process.argv.length; i++) {
    params += (` ${process.argv[i]}`)
  }

  return params
}

function shutdown( exitCode ) {
  if (selenium && selenium.child) {
    selenium.child.kill()
  }

  if ( webserver_stream ) {
    webserver_stream.emit('kill')
  }

  return process.exit(exitCode || 0)
}

function waitForBackend( iteration, done ) {
  tcpPortUsed.check(env_config.api.port, env_config.api.host)
  .then((inUse) => {
    if ( !inUse ) {
      if (iteration < env_config.api.timeout) {
        if (iteration == 0) {
          console.error("Backend not (yet) available at " + env_config.api.url,
            "\nWaiting for backend...")
        }
        iteration++
        setTimeout(() => {
          waitForBackend( iteration, done )
        }, 1000)
      } else {
        console.error("Backend not available after " + iteration + " seconds. Shutting down...")
        shutdown(2)
      }
    } else {
      console.log("Backend available at " + env_config.api.url)
      done()
    }
  }, (err) => {
    console.error("Error checking for availability of backend at " + env_config.api.url,
      "\nPlease make sure that backend can be reached at " + env_config.api.url)
    shutdown(2)
  })
}

function waitForWebSockerServer( iteration, done ) {
  tcpPortUsed.check(env_config.wsserver.port, env_config.wsserver.host)
  .then((inUse) => {
    if ( !inUse ) {
      if (iteration < env_config.api.timeout) {
        if (iteration == 0) {
          console.error("Web socket server not (yet) available at " + env_config.wsserver.url,
            "\nWaiting for web socket server...")
        }
        iteration++
        setTimeout(() => {
          waitForWebSockerServer( iteration, done )
        }, 1000)
      } else {
        console.error("Web socket server not available after " + iteration + " seconds. Shutting down...")
        shutdown(2)
      }
    } else {
      console.log("Web socket server available at " + env_config.wsserver.url)
      done()
    }
  }, (err) => {
    console.error("Error checking for availability of backend at " + env_config.wsserver.url,
      "\nPlease make sure that web socket server can be reached at " + env_config.wsserver.url)
    shutdown(2)
  })
}

gulp.task('http', () => {

  tcpPortUsed.check(port, 'localhost')
  .then( (inUse) => {
    if ( !inUse ) {
      webserver_stream = gulp.src(config.paths.build)
      .pipe(webserver({
        host: 'localhost',
        port: port,
        fallback: 'index.html'
      }))

      console.log("Webserver listening on port " + port)

    } else {
      console.log("Port " + port + " is already in use - Skipping web server!")
    }
  }, (err) => {
    console.error("error checking for availability of port " + port)
  })
})

gulp.task('wait_for_backend', (done) => {
  return waitForBackend( 0, done )
})

gulp.task('wait_for_websocket_server', (done) => {
  return waitForWebSockerServer( 0, done )
})

function system_test_callback( err, done ) {
  if (err) {
    // stop web server
    if ( webserver_stream ) {
      webserver_stream.emit('kill')
    }
    const exitCode = 2
    console.error(gutil.colors.red('[FAIL] "gulp system_tests" failed - exiting with code ' + exitCode))
    return process.exit(exitCode)
  }
  else {
    // stop gulp task
    if ( webserver_stream ) {
      webserver_stream.emit('kill')
    }
    return done(console.log(gutil.colors.green('All System Tests passed!')))
  }
}

gulp.task('system_tests', () => {
  let cmdAdds = ''

  // skip first 3 params, which are node location, gulp location, gulp task
  for (let i = 3; i < process.argv.length; i++) {
    cmdAdds += (' ' + process.argv[i])
  }

  const env = process.env.NODE_ENV || 'test'

  const cmd = `NODE_ENV=${env} gulp system_tests_start${cmdAdds} --colors; npm run generate_test_results`

  return gulp.src('', {read:false})
    .pipe(shell([
      cmd
    ]))
})

gulp.task('system_tests_headless', () => {
  
  const env = process.env.NODE_ENV || 'test'

  const cmd = `NODE_ENV=${env} xvfb-run --server-args="-screen 0, 1366x768x24" gulp system_tests_start${makeParams()} --colors`

  return gulp.src('', {read:false})
    .pipe(shell([
      cmd
    ]))
})

gulp.task('system_tests_start', ['selenium_start', 'prepare_system_tests', 'wait_for_backend', 'wait_for_websocket_server'], (done) => {
  let build = true

  // skip first 3 params, which are node location, gulp location, gulp task
  for (let i = 3; i < process.argv.length; i++) {
    if (process.argv[i] === '--nobuild') {
      build = false
    }
  }

  if (build) {
    return runSequence( 'set_test', 'get_statics_file', 'markup', 'app_loader', 'webpack', 'http', 'run_system_tests', 'selenium_stop',
      (err) => {
        system_test_callback( err, done )
      }
    )
  } else {
    return runSequence( 'set_test', 'http', 'run_system_tests', 'selenium_stop',
      (err) => {
        system_test_callback( err, done )
      }
    )
  }
})

gulp.task('system_tests_dist', () => {
  const cmd = 'NODE_ENV=test gulp system_tests_start_dist' + makeParams() + ' --colors'

  return gulp.src('', {read:false})
    .pipe(shell([
      cmd
    ]))
})

gulp.task('system_tests_headless_dist', () => {
  const cmd = 'NODE_ENV=test xvfb-run --server-args="-screen 0, 1366x768x24" gulp system_tests_start_dist' + makeParams() + " --colors"

  return gulp.src('', {read:false})
    .pipe(shell([
      cmd
    ]))
})

gulp.task('system_tests_start_dist', ['selenium_start', 'prepare_system_tests', 'wait_for_backend', 'wait_for_websocket_server'], (done) => {
  let build = true

  // skip first 3 params, which are node location, gulp location, gulp task
  for (let i = 3; i < process.argv.length; i++) {
    if (process.argv[i] === '--nobuild') {
      build = false
    }
  }

  if (build) {
    return runSequence( 'set_productive', 'get_statics_file', 'markup', 'app_loader', 'webpack', 'http', 'run_system_tests', 'selenium_stop',
      (err) => {
        system_test_callback( err, done )
      }
    )
  } else {
    return runSequence( 'set_productive', 'http', 'run_system_tests', 'selenium_stop',
      (err) => {
        system_test_callback( err, done )
      }
    )
  }
})

gulp.task( 'remote_system_tests', () => {
  const cmd = 'NODE_ENV=test gulp remote_system_tests_logic' + makeParams() + ' --colors'

  return gulp.src('', {read:false})
    .pipe(shell([
      cmd
    ]))
})

gulp.task( 'remote_system_tests_logic', ['wait_for_selenium', 'wait_for_selenium_webserver', 'wait_for_selenium_backend'], (done) => {
  return runSequence( 'prepare_system_tests', 'run_system_tests' )
})

gulp.task('wait_for_selenium', (done) => {
  console.log(`Selenium: ${env_config.selenium.host}:${env_config.selenium.port}`)
  return waitFor( 
    "Selenium", env_config.selenium.host, env_config.selenium.port, 
    0, done, () => { process.exit(2) }, env_config.selenium.timeout )
})

gulp.task('wait_for_selenium_webserver', (done) => {
  console.log(`Webserver: ${env_config.webserver.host}:${env_config.webserver.port}`)
  return waitFor( "Webserver", env_config.webserver.host, env_config.webserver.port, 
    0, done, () => { process.exit(2) }, env_config.selenium.timeout )
})

gulp.task('wait_for_selenium_backend', (done) => {
  console.log(`Backend: ${env_config.api.host}:${env_config.api.port}`)
  return waitFor( "Backend", env_config.api.host, env_config.api.port, 
    0, done, () => { process.exit(2) }, env_config.selenium.timeout )
})

function waitFor( connectionName, host, port, iteration, done, errCb, timeout ) {
  tcpPortUsed.check(port, host)
  .then((inUse) => {
    if ( !inUse ) {
      if (iteration < timeout) {
        if (iteration == 0) {
          console.error(`${connectionName} not (yet) available at ${host}:${port}`,
            `\nWaiting for ${connectionName}...`)
        }
        iteration++
        setTimeout(() => {
          waitFor( connectionName, host, port, iteration, done, errCb, timeout )
        }, 1000)
      } else {
        console.error(`${connectionName} not available after ${iteration} seconds. Shutting down...`)
        errCb()
      }
    } else {
      console.log(`${connectionName} available at ${host}:${port}`)
      done()
    }
  }, (err) => {
    console.error(`Error checking for availability of ${connectionName} at ${host}:${port}`,
      `\nPlease make sure that ${connectionName} can be reached at ${host}:${port}`)
    errCb()
  })
}