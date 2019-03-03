import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { List } from 'office-ui-fabric-react/lib/List';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';

import './Feed.css';
import './Global.css';

interface IFeedItem {
  name: string;
  description: string;
  thumbnail?: string;
}

interface IFeedProps {
  items: IFeedItem[];
}

interface IFeedState {
  filterText?: string;
  items: IFeedItem[];
}

const allFeedItems: IFeedItem[] = [
  {
    description: "The domestic dog (Canis lupus familiaris when considered a subspecies of the wolf or Canis familiaris when considered a distinct species) is a member of the genus Canis (canines), which forms part of the wolf-like canids, and is the most widely abundant terrestrial carnivore. The dog and the extant gray wolf are sister taxa as modern wolves are not closely related to the wolves that were first domesticated, which implies that the direct ancestor of the dog is extinct. The dog was the first species to be domesticated and has been selectively bred over millennia for various behaviors, sensory capabilities, and physical attributes.",
    name: "Dog",
    thumbnail: "https://images.freeimages.com/images/large-previews/62b/dog-1538908.jpg"
  },
  {
    description: "The cat or domestic cat (Felis catus) is a small carnivorous mammal. It is the only domesticated species in the family Felidae. The cat is either a house cat, kept as a pet, or a feral cat, freely ranging and avoiding human contact. A house cat is valued by humans for companionship and for its ability to hunt rodents. About 60 cat breeds are recognized by various cat registries.",
    name: "Cat",
    thumbnail: "https://images.freeimages.com/images/large-previews/466/cat-1401781.jpg"
  },
  {
    description: "Rabbits are small mammals in the family Leporidae of the order Lagomorpha (along with the hare and the pika). Oryctolagus cuniculus includes the European rabbit species and its descendants, the world's 305 breeds of domestic rabbit. Sylvilagus includes 13 wild rabbit species, among them the 7 types of cottontail. The European rabbit, which has been introduced on every continent except Antarctica, is familiar throughout the world as a wild prey animal and as a domesticated form of livestock and pet. With its widespread effect on ecologies and cultures, the rabbit (or bunny) is, in many areas of the world, a part of daily life—as food, clothing, a companion, and as a source of artistic inspiration.",
    name: "Rabbit",
    thumbnail: "https://images.freeimages.com/images/large-previews/4c3/rabbit-1402890.jpg"
  },
  {
    description: "Cattle—colloquially cows—are the most common type of large domesticated ungulates. They are a prominent modern member of the subfamily Bovinae, are the most widespread species of the genus Bos, and are most commonly classified collectively as Bos taurus.",
    name: "Cow",
    thumbnail: "https://images.freeimages.com/images/large-previews/008/cows-1323375.jpg"
  },
  {
    description: "The tiger (Panthera tigris) is the largest species among the Felidae and classified in the genus Panthera. It is most recognizable for its dark vertical stripes on reddish-orange fur with a lighter underside. It is an apex predator, primarily preying on ungulates such as deer and bovids. It is territorial and generally a solitary but social predator, requiring large contiguous areas of habitat, which support its requirements for prey and rearing of its offspring. Tiger cubs stay with their mother for about two years, before they become independent and leave their mother's home range to establish their own.",
    name: "Tiger",
    thumbnail: "https://images.freeimages.com/images/large-previews/137/tiger-1391526.jpg"
  }
]

export class Feed extends React.Component<IFeedProps, IFeedState> {

  constructor(props: IFeedProps) {
    super(props);

    this._onFilterChanged = this._onFilterChanged.bind(this);

    this.state = {
      filterText: '',
      items: allFeedItems
    };
  }

  public render(): JSX.Element {
    const originalItems = allFeedItems;
    const { items } = this.state;

    const resultCountText = items.length === originalItems.length ? '' : ` (${items.length} of ${originalItems.length} shown)`;

    return (
      <div>
        <div className="Global-heading">
          <h1>Feed</h1>
        </div>
        <FocusZone direction={FocusZoneDirection.vertical}>
          <TextField label={'Filter by name' + resultCountText} onBeforeChange={this._onFilterChanged} />
          <List items={items} onRenderCell={this._onRenderCell} />
        </FocusZone>
      </div>
    );
  }

  private _onFilterChanged(text: string): void {
    const items = allFeedItems;

    this.setState({
      filterText: text,
      items: text ? items.filter(item => item.name.toLowerCase().indexOf(text.toLowerCase()) >= 0) : items
    });
  }

  private _onRenderCell(item: any, index: number | undefined): JSX.Element {
    return (
      <div className="Feed-itemCell" data-is-focusable={true}>
        <div className="Feed-itemHeader">
          <Image className="Feed-image" src={item.thumbnail} width={50} height={50} imageFit={ImageFit.cover} />
          <div className="Feed-itemHeaderDetails">
            <div className="Feed-itemName">{item.name}</div>
            <div className="Feed-itemIndex">{`Item ${index}`}</div>
          </div>
        </div>
        <div className="Feed-itemDesc">{item.description}</div>
      </div>
    );
  }
}