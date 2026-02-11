# Time and Dates

## Summary

Use Day.js and standardized UTC ISO-8601 serialization for date and time handling in frontend code.

## Rule

- Use Day.js for date and time operations instead of ad-hoc native date logic.
- Serialize timestamps in ISO-8601 UTC format.
- Avoid locale-dependent or ambiguous string formats in stored or transferred values.

## Description

Consistent time handling reduces bugs in filtering, comparisons, and API communication. Zetkin uses Day.js with plugins such as UTC, IsoWeek, and CustomParseFormat. Serialized values should stay machine-safe and timezone-explicit.

The most common frontend serialization format is `YYYY-MM-DDTHH:mm:ss.SSSZ` (for example `2024-07-23T12:55:14.279Z`).

## Do's

```ts
const nowIso = new Date().toISOString();
```

## Don'ts

```ts
const now = new Date().toString();
```

## Exceptions

If an external API contract explicitly requires a different date format, convert at the boundary and keep internal handling standardized.

## References

- [Day.js](https://day.js.org/)
- [UTC plugin](https://day.js.org/docs/en/plugin/utc)
- [IsoWeek plugin](https://day.js.org/docs/en/plugin/iso-week)
- [CustomParseFormat plugin](https://day.js.org/docs/en/plugin/custom-parse-format)
