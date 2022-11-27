# hot-takes

Twitter bot to post programming hot takes.
These are randomly generated using templates inspired by various sources.
None of the hot takes are meant to be taken seriously, and most are borderline incomprehensible.

All the hot takes can be found in [hotTakeData.json](hotTakeData.json).
The data is separated into different categories, which are randomly selected when generating a hot take.

Some data will reference images, which can be found in [img/](img).
**None of the images are mine, and all credit goes to their respective owners.**

## Adding/editing hot takes

All the takes are stored in [hotTakeData.json](hotTakeData.json).
Most of this data should be fairly self-explanatory.

In `takes` fields, the following placeholders can be used:

- `{language}` - a random value from the `languages` array
- `{technology}` - a random value from the `technologies` array
- `{tld}` - a random value from the `tlds` array
- `{thing}` - a random `language` or `technology`
- `{oneWordThing}` - like `{thing}`, but compressed to one word by stripping spaces. Eg "FreeSoftwareFoundation"
  instead of "Free Software Foundation"
- `{anything}` - a random element from `languages ∪ technology ∪ people ∪ companies`
- `{oneWordAnything}` - like `{anything}`, but compressed to one word by stripping spaces. Eg "FreeSoftwareFoundation"
  instead of "Free Software Foundation"
- `{person}` - a random value from the `people` array
- `{company}` - a random value from the `companies` array
- `{group}` - a random value from the `people` or `companies` array
- `{problem}` - a random value from the `problems` array
- `{year}` - a random integer between 1500 and 2022
- `{age}` - a random number between 1 and 50
- `{bigNumber}` - a random number between 2 and 100000
- `{percentage}` - a random number between 1 and 100

To generate a take, firstly a random element from the `takes` array is selected.
Then, the placeholders are replaced with random values from the other arrays as described above.

Any images from a selected take or placeholder value are appended and uploaded as part of the Tweet, with a maximum of 4
Image usage is encouraged to make the Tweets more engaging.

## Running the bot

Copy [.env.template](.env.template) to `.env` and fill in the values. These can be obtained from the Twitter Developer
Portal.
For documentation on what the values mean, see [src/config.ts](src/config.ts).

Then, run `npm install` to install dependencies, and `npm build` to compile the bot. Finally, run `npm start` to run the
bot.