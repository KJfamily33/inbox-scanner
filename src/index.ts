import fs from 'fs';
import { gmail_v1 } from 'googleapis';
import VError from 'verror';
import { getUrlsFromMessages } from './lib/extract_urls';
import { getFileUrls } from './lib/file_url';
import { getMessages } from './lib/message';
import { authorize } from './lib/oauth';
import { getPublicUrls } from './lib/public_file_url';
import { getUniqueUrls } from './lib/unique_urls';

fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content.toString()), main);
});

async function main(gmail: gmail_v1.Gmail) {
  // [Error case] Promise fails
  const allMessages = await getMessages(gmail).catch((err: Error) => {
    const wrappedError = new VError(
      err,
      'Failed to retrieve your email messages'
    );
    console.error(wrappedError.message);
    process.exit();
  });

  console.log(`Got ${allMessages.length} message(s)`);

  // [Error case] Promise fails
  const allUrls = await getUrlsFromMessages(gmail, allMessages).catch(
    (err: Error) => {
      const wrappedError = new VError(
        err,
        'Failed to extract URLs from your email messages'
      );
      console.error(wrappedError.message);
      process.exit();
    }
  );

  console.log('all URLs:');
  console.log(allUrls);

  const fileUrls = getFileUrls(allUrls);

  console.log('file URLs:');
  console.log(fileUrls);

  // [Error case] Promise fails
  const publicUrls = await getPublicUrls(fileUrls).catch((err: Error) => {
    const wrappedError = new VError(
      err,
      'Failed to identify which of the file links in your email inbox are public'
    );
    console.error(wrappedError.message);
    process.exit();
  });

  console.log('public URLs:');
  console.log(publicUrls);

  const uniquePublicUrls = getUniqueUrls(publicUrls);

  console.log('unique public URLs:');
  console.log(uniquePublicUrls);
}

// ERROR HANDLING - TO DO

// identify error cases
// - annotate all my await clauses as error cases - DONE

// add catch clauses to handle my error cases
// - in index.ts - DONE

// TESTING - TO DO

// to do: make my functions easier to test. remove side effects, try to create
// as many pure functions as I can that map some input to some output. minimize code
// paths in each function - DONE

// to do: make getText easier to test

// to do: write tests for my testable functions
// in extract_urls.ts
// in file_url.ts
// in message.ts
// in oauth.ts
// in public_file_url.ts
// in unique_urls.ts

// first: annotate my functions in lib/ based on their testability - DONE

// also check against my real email account to see how long it takes

// CODE IMPROVEMENT - LATER

// look through my code in lib/ and improve it.

// also: each function should be written at the right abstraction layer. don't violate
// abstraction barriers

// improve my code based on this repo: https://github.com/goldbergyoni/nodebestpractices

// PRESENTATION - TO DO

// - Create README file.
// - Maybe - document how my code is organized. In a CONTRIBUTING.md file?
// - Maybe - post my project on Reddit and HN

// ONCE THE ABOVE IS DONE --

// to do: remove my q: "patrick6" query parameter

// look at the takehome requirements and make sure I follow them
// in particular, ensure I support the provided `yarn` commands

// to do: create a gmail account and test my program against it

// NOT NOW ---

// maybe: get travis CI working for this repo
// Include Travis CI badge in README

// LATER ---

// I also can have Gianluca or someone else code review my code to make sure it's high quality - LATER

// DONE ---

// to do: remove console.log statements from all my lib/* files - DONE

// to do: choose either url or url but don't use both - DONE

// to do: look at my files in lib/. are the dependencies only one way, based on the layers above? - DONE

// to do: I should only import these 5 functions in this file - DONE
// getMessages, getAllUrls, getFileUrls, getPublicUrls, getUniqueUrls - DONE

// to do: modify getAllUrls so it takes in a list of messages (maybe). want to
// have a chain: for each message: message > text > urls > file urls > public file urls
// > unique public file urls - DONE

// to do: look at any "to do" comments in my code - DONE

// To do: I should not have url as both a variable name and as an imported module - DONE

// I should move from Promise.all to Bluebird.map - DONE

// to do: remove console.log statements from lib/ - DONE

// also: convert my code to use async/await instead of promises - DONE

// I also want to remove "auth" as an argument from my methods - DONE
