To check that incremental builds are working I:

1. `yarn build`
2. Delete the `.d.ts` file in `dist` (if incremental builds are working the next step should not emit any files because tsbuldinfo thinks they are already on the system)
3. `yarn build`

To check that the builds are fast run

1. `yarn build` (get initial emit) ~2.5s
2. `yarn build` (second emit should be much shorter) ~2.5s

Compare this with `tsc`:

1. `yarn tsc -b tsconfig.json --incremental` (first time takes ~2s)
2. `yarn tsc -b tsconfig.json --incremental` (second time takes 0.31s)
