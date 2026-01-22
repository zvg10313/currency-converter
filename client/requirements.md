## Packages
framer-motion | For smooth entry animations and list transitions
clsx | For conditional class merging
tailwind-merge | For merging tailwind classes utility

## Notes
- Session ID generation: The app generates a UUID on first load and stores it in localStorage ('currency_converter_session') to track history across reloads without login.
- Real-time conversion happens client-side for immediate feedback.
- History saving is debounced to prevent API spamming while typing.
