---
title: Time
category: Time
---

# Time

## Day.js

Zetkin uses [Day.js](https://day.js.org/) to work with times and dates. Plugins used include [UTC](https://day.js.org/docs/en/plugin/utc), [IsoWeek](https://day.js.org/docs/en/plugin/iso-week), and [CustomParseFormat](https://day.js.org/docs/en/plugin/custom-parse-format).

## Serialization Format

The most commonly used date serialization format around the Zetkin front end is `2024-07-23T12:55:14.279Z`. A code search for [`new Date().toISOString()`](<https://github.com/search?q=repo%3Azetkin%2Fapp.zetkin.org%20%22new%20Date().toISOString()%22&type=code>) shows all the places where the current date & time are being serialized using this format by the front end code.

## Response Format

The Zetkin back end's resonses sometimes include dates serialized using a different format, with a `+00:00` suffix instead of the `Z` that the front end's `toISOString()` approach uses to denote the UTC timezone. For these, we use {@link removeOffset removeOffset} to strip the `+00:00` off the end.
