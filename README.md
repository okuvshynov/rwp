## Run-with-perf (rwp)

in ~abandoned state. Idea here was to build something like godbolt, but rather than showing compiled asm, it would run the snippet and measure some counters from PMU (like cycles, cache misses, instructions, etc.). I thought it could be useful with more exotic counters, see for example this: https://github.com/okuvshynov/rwp/blob/master/tests/mock/mock_src.asm for some very old intel CPU. 

I don't know if I'll ever have time to complete this. 

# rwp

To run:

1) node service/app.js
2) node executors/client.js
3) visit localhost:3031
4) put event/src

