# Velkom te Laphurdeen — Landing Page

The tourism landing page of the Commonwealth of Laphurdeen. It markets the
country through its Constitution: the consensus democracy with no president,
the Charter of Rights, and the constitutional comforts a traveller actually
feels (tax-inclusive prices, fare-capped transport, the pegged krona).

Every fact traces to canon — `CONSTITUTION.md`, `NATIONAL_SYMBOLS.md`,
`LAPHURDI.md` — and every Laphurdi string on the page is attested there.
No new coinages here; that's the Language Commission's job.

## Develop

```sh
npm install
npm run dev       # local dev server
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
```

## Deploy

`.github/workflows/deploy-pages.yml` publishes one GitHub Pages artifact for
the whole repo: this app at the site root, the Oversettaren translator under
`/translator/`. GitHub Pages allows a single deployment per repository, so
both apps must ship in the same artifact.
