"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("./page_objects/builders");
const storyMap = new Map();
const words = {
    'Given': 'Given',
    'When': 'When',
    'Then': 'Then',
    'And': 'And',
};
exports.Feature = (description, metadata, bodyFunc, jasmineFunc = describe) => {
    this.__currentFeature = description;
    jasmineFunc(`${description}:`, bodyFunc);
};
exports.fFeature = (description, metadata, bodyFunc) => {
    exports.Feature(description, metadata, bodyFunc, fdescribe);
};
exports.xFeature = (description, metadata, bodyFunc) => {
    exports.Feature(description, metadata, bodyFunc, xdescribe);
};
exports.Story = (id, description, metadata, bodyFunc, jasmineFunc = describe) => {
    const fullStoryName = `${id} - ${description}`;
    this.__currentStoryId = id;
    storyMap.set(id, {
        descriptionStack: { givens: [], whens: [] },
        metadata: metadata,
        featureName: this.__currentFeature,
        storyName: fullStoryName,
        insideWhenSequence: false,
        whenSequenceLengths: [],
        whenRecLevel: 0,
        insideGivenSequence: false,
        givenSequenceLengths: [],
        givenRecLevel: 0
    });
    jasmineFunc(fullStoryName, bodyFunc);
};
exports.fStory = (id, description, metadata, bodyFunc) => {
    exports.Story(id, description, metadata, bodyFunc, fdescribe);
};
exports.xStory = (id, description, metadata, bodyFunc) => {
    exports.Story(id, description, metadata, bodyFunc, xdescribe);
};
exports.Given = (description, bodyFunc) => {
    const story = storyMap.get(this.__currentStoryId);
    const prevRecDepth = story.givenSequenceLengths.length;
    // new given block
    if (!story.insideGivenSequence) {
        // remove descriptions from previous given blocks in same recursion level
        const prevGivens = story.givenSequenceLengths[story.givenRecLevel];
        for (let i = 0; i < prevGivens; ++i) {
            story.descriptionStack.givens.pop();
        }
        story.givenSequenceLengths[story.givenRecLevel] = 0;
    }
    else {
        story.insideGivenSequence = false;
    }
    story.descriptionStack.givens.push(description);
    if (bodyFunc) {
        // for counting number of given sequence elements in nested block
        story.givenSequenceLengths.push(0);
        story.givenRecLevel++;
        bodyFunc();
        story.givenRecLevel--;
        const newRecDepth = story.givenSequenceLengths.length;
        // removes descriptions of nested givens
        if (newRecDepth > prevRecDepth) {
            const nestedDescriptionsCount = story.givenSequenceLengths[newRecDepth - 1];
            for (let i = 0; i < nestedDescriptionsCount; ++i) {
                story.descriptionStack.givens.pop();
            }
        }
        story.givenSequenceLengths.pop();
    }
    // if there is no count for current recursion level yet
    if (story.givenSequenceLengths.length <= story.givenRecLevel) {
        story.givenSequenceLengths.push(0);
    }
    // increase length of sequence in current recursion level
    story.givenSequenceLengths[story.givenSequenceLengths.length - 1]++;
    return {
        "And": (description, bodyFunc) => {
            story.insideGivenSequence = true;
            return exports.Given.call(this, description, bodyFunc);
        }
    };
};
exports.When = (description, bodyFunc) => {
    const story = storyMap.get(this.__currentStoryId);
    const prevRecDepth = story.whenSequenceLengths.length;
    // new when block
    if (!story.insideWhenSequence) {
        // remove descriptions from previous when blocks in same recursion level
        const prevWhens = story.whenSequenceLengths[story.whenRecLevel];
        for (let i = 0; i < prevWhens; ++i) {
            story.descriptionStack.whens.pop();
        }
        story.whenSequenceLengths[story.whenRecLevel] = 0;
    }
    else {
        story.insideWhenSequence = false;
    }
    story.descriptionStack.whens.push(description);
    if (bodyFunc) {
        // for counting number of when sequence elements in nested block
        story.whenSequenceLengths.push(0);
        story.whenRecLevel++;
        bodyFunc();
        story.whenRecLevel--;
        const newRecDepth = story.whenSequenceLengths.length;
        // removes descriptions of nested whens
        if (newRecDepth > prevRecDepth) {
            const nestedDescriptionsCount = story.whenSequenceLengths[newRecDepth - 1];
            for (let i = 0; i < nestedDescriptionsCount; ++i) {
                story.descriptionStack.whens.pop();
            }
        }
        story.whenSequenceLengths.pop();
    }
    // if there is no count for current recursion level yet
    if (story.whenSequenceLengths.length <= story.whenRecLevel) {
        story.whenSequenceLengths.push(0);
    }
    // increase length of sequence in current recursion level
    story.whenSequenceLengths[story.whenSequenceLengths.length - 1]++;
    return {
        "And": (description, bodyFunc) => {
            story.insideWhenSequence = true;
            return exports.When.call(this, description, bodyFunc);
        }
    };
};
exports.Then = (id, description, jasmineFunc = it, skip = false) => {
    const story = storyMap.get(this.__currentStoryId);
    const storyId = this.__currentStoryId;
    const stepFunc = (title) => {
        process.send({ event: 'step:start', title: title });
        process.send({ event: 'step:end' });
    };
    const reduceFunc = (acc, cur) => acc + `\n${words.And} ` + cur;
    const givenDescriptions = [`${words.Given} ${story.descriptionStack.givens[0]}`]
        .concat(story.descriptionStack.givens
        .slice(1, story.descriptionStack.givens.length)
        .map(description => `${words.And.toLocaleLowerCase()} ${description}`));
    const whenDescriptions = [`${words.When} ${story.descriptionStack.whens[0]}`]
        .concat(story.descriptionStack.whens
        .slice(1, story.descriptionStack.whens.length)
        .map(description => `${words.And.toLocaleLowerCase()} ${description}`));
    const thenDescription = `${words.Then} ${description}`;
    const allDescriptions = givenDescriptions.concat(whenDescriptions).concat([thenDescription]);
    const skipFunc = (skip) ? () => { pending(); } : undefined;
    const bodyFunc = () => {
        // allure report metadata
        process.send({ event: 'test:meta', feature: `${story.featureName}` });
        process.send({ event: 'test:meta', story: `${story.storyName}` });
        process.send({ event: 'test:meta', issue: story.metadata.issues });
        process.send({ event: 'test:meta', severity: story.metadata.severity || 'normal' });
        // create an allure step for each given and when
        allDescriptions.slice(0, allDescriptions.length - 1).forEach(description => stepFunc(description));
        // for last allure step (then), check if results where correct
        process.send({ event: 'step:start', title: allDescriptions[allDescriptions.length - 1] });
        process.send({ event: 'step:end', verify: {
                criteriaId: id,
                storyId: storyId
            } });
    };
    const testData = {
        title: `${words.Then} ${id}: ${description}`,
        metadata: {
            feature: story.featureName,
            story: story.storyName,
            issue: story.metadata.issues,
            severity: story.metadata.severity
        }
    };
    jasmineFunc(JSON.stringify(testData), skipFunc || bodyFunc);
};
exports.fThen = (id, description) => {
    exports.Then(id, description, fit);
};
exports.xThen = (id, description) => {
    exports.Then(id, description, it, true);
};
exports.suite = (description, metadata, bodyFunc, jasmineFunc = describe) => {
    if (description.indexOf('.') > -1) {
        throw new Error(`Suite description must not contain '.' character: ${description}`);
    }
    jasmineFunc(description, bodyFunc);
};
exports.fsuite = (description, metadata, bodyFunc) => {
    exports.suite(description, metadata, bodyFunc, fdescribe);
};
exports.xsuite = (description, metadata, bodyFunc) => {
    exports.suite(description, metadata, bodyFunc, xdescribe);
};
exports.testcase = (description, metadata, bodyFunc, jasmineFunc = it) => {
    if (description.indexOf('.') > -1) {
        throw new Error(`Testcase description must not contain '.' character: ${description}`);
    }
    this.__stepStack = [];
    const testData = {
        title: description
    };
    jasmineFunc(JSON.stringify(testData), bodyFunc);
};
exports.ftestcase = (description, metadata, bodyFunc) => {
    exports.testcase(description, metadata, bodyFunc, fit);
};
exports.xtestcase = (description, metadata, bodyFunc) => {
    exports.testcase(description, metadata, () => { pending(); });
};
const _when = function (step, prefix) {
    //process.send({event: 'step:start', title: `${prefix} ${step.description}`})
    step.execute(prefix);
    //process.send({event: 'step:end'})
    return {
        "and": step => _when(step, words.And.toLowerCase())
    };
};
const _given = function (step, prefix) {
    //process.send({event: 'step:start', title: `${prefix} ${step.description}`})
    step.execute(prefix);
    //process.send({event: 'step:end'})
    return {
        "and": step => _given(step, words.And.toLowerCase()),
        "when": step => _when(step, words.When)
    };
};
exports.given = function (step) {
    return _given(step, words.Given);
};
exports.verify = function (specObj, func) {
    const verifyContainer = {
        specObj: specObj
    };
    process.send({ event: 'verify:start', specObj: specObj });
    const _process = process;
    if (typeof _process.workflo === 'undefined') {
        _process.workflo = {};
    }
    _process.workflo.specObj = specObj;
    process.send({ event: 'step:start', title: `verify: ${JSON.stringify(specObj)}` });
    func();
    process.send({ event: 'verify:end', specObj: specObj });
    process.send({ event: 'step:end', type: 'verifyEnd' });
    _process.workflo.specObj = undefined;
};
function xpath(selector) {
    return builders_1.XPathBuilder.getInstance().reset(selector);
}
exports.xpath = xpath;
//# sourceMappingURL=api.js.map