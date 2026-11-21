# Starblade Academy store listing

Copy for the Apple App Store and Google Play. No accounts were created and nothing was submitted. The privacy notes match the app as of this file: progress stays on the device, and the app code does not send it anywhere.

## Name

Starblade Academy

Apple app name limit is 30 characters. This name is 17.

## Short text

Apple subtitle (30 character limit):

Math, reading, and a dragon

Google Play short description (80 character limit):

Math, reading, writing, and a pet dragon. Progress stays on this device.

Apple promotional text (170 character limit, can be changed without a new build):

A learning game with a pet dragon. Stars and days played only go up.

## Long description

Use this for the Apple description and the Google Play full description.

Starblade Academy is a learning game for children. Practice math, reading, writing, drawing, and geography. A pet dragon hatches and grows as you practice.

What is inside:

- Math with times tables, word problems, place value, and fractions
- Reading passages, word practice, reading together, and a reading log
- A story builder and a story book
- A pet dragon that grows through stages and does not shrink
- Days played and stars that only go up. Skipping a day does not take them away

Progress stays on the device. There is no account, no ads, and no in-app purchases. A grown-up can export a backup file and import it on another device.

A Grown-up Corner opens with a press and hold. It holds settings, backup, and reset.

## Privacy policy

Use the privacy page that already ships with the site (`privacy.html`) as the store privacy policy URL.

What to tell the stores, because this is what the app does:

- No account and no sign-in
- No ads, no tracking, and no analytics
- No in-app purchases
- No data sent to a server. The app saves progress in local storage on the device.
- A grown-up can export a file or a backup code. That file stays wherever the grown-up puts it. The app does not upload it.
- The only network use is loading the app's own files when it is installed from the website. The store build copies those files into the app.
- Read-aloud uses the voice already on the device.
- To erase everything, a grown-up uses Reset in the Grown-up Corner, or deletes the app.

If a store form asks "do you collect data?", answer no, unless you later add accounts, ads, or anything that leaves the device. If you add that, update `privacy.html` first.

## Age rating notes

These are notes for the questionnaires. They are not a finished rating and not legal advice. Answer from the app you submit. The form result is the rating.

Likely shape of the answers, from the app as it is now:

- Cartoon fantasy. No realistic violence. Dragons and star pictures are the theme. There is no fighting game.
- No unrestricted web browser. The app does not open a general website for children.
- No ads, no commerce, no loot boxes, no simulated gambling.
- No location, no contacts, no camera, no microphone recording, no chat with strangers.
- A child can type a first name or nickname, stories, and reading log titles. Those stay on the device. They are not posted anywhere.
- A grown-up can export that text in a backup file.

Apple's kids category and Google's Families program have extra rules. Read the current rules before you opt in. The For Parents page is inside the app and on the same site. It does not send children to a third-party site. If a kids-program reviewer wants that page behind the grown-up hold, move the home-screen link.

## Screenshot list

Capture these on a phone after you install a test build. Use a made-up explorer name. Do not use a real child's name in the picture.

1. Home: the explorer name, the days-played count, and the dragon.
2. A math mission in progress, with no score penalty on screen.
3. A reading passage or Read Together.
4. The story builder or story book.
5. The pet dragon, showing its stage.
6. The who-is-playing screen, if more than one explorer is on the device.

Take them in portrait.

Apple, from Apple's screenshot specifications (check the upload form; it is the final word):

- At least one screenshot for iPhone with Dynamic Island (medium display). Portrait sizes that page lists include 1179 x 2556 and 1206 x 2622.
- If the app runs on iPad, at least one screenshot for the 13-inch iPad display. Portrait sizes that page lists include 2064 x 2752 and 2048 x 2732.
- JPEG or PNG, no transparency. Up to 10 per device size.
- If the layout is the same on every size, the form can scale one set down. You can still upload a separate iPad set.

Google Play, from Play Console preview-asset help (check the upload form):

- At least 2 phone screenshots. JPEG or 24-bit PNG, no transparency. Each side from 320 to 3840 pixels. The long side at most twice the short side. Up to 8 per device type.
- For the larger recommendation layouts: at least 4 screenshots, 9:16, at least 1080 x 1920.
- A feature graphic, 1024 x 500, JPEG or 24-bit PNG, no transparency.
- A 512 x 512 icon, 32-bit PNG, up to 1024 KB. The project already has `icons/icon-512.png`.

## Icons and splash already in the project

- App name on the home screen: Starblade Academy
- Source icon: `assets/icon-only.png` (1024 x 1024), enlarged from the existing 512 icon. Replace it with a newly drawn 1024 icon if you want a cleaner store icon, then run `npm run assets`.
- Source splash: `assets/splash.png` (2732 x 2732), dark background with the icon in the center.
- Android launcher icons and splash images are under `android/app/src/main/res/`.
- iOS icon and splash are under `ios/App/App/Assets.xcassets/`.
