# botpress-web

## How to run this

**Important:** You will need to run the development botpress branch (`next`) in order for this demo to work. The reason is because the fullscreen features is unreleased yet.

- Compile botpress on branch `next`
- `npm link ../path/to/botpress` in your bot
- Run your bot and navigate to the `botpress-web` module interface
- Append the `viewMode=3` to the URL query to put it in fullscreen

## TODO

- Users are currently all anonymous / unauthenticated / unidentified
- This works only with one user (the bot currently broadcasts to all users)
- Change the background
- Fix the File Selector
- Handle File Uploads
- Handle typing indicator

### Pro Version
- Make the chat style customizable (pro version, ask @Sylvain about this)

## Caveats

- If you're running the bot in NODE_ENV=production, the module will prompt a login screen. We solved this situation in Botpress Pro (ask @Sylvain about this). To run this in production you essentially need a Pro version due to technical limitations regarding authentication & UI.

## Credits

Thanks to James Campbell for the original code of the Web Interface (code from Bottr)!
