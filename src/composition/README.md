# Composition Root

This is the only place where concrete infrastructure adapters are assembled and
passed to application use cases or presentation providers. It may import every
layer. No other layer may import infrastructure directly.

The first implementation belongs here only after Day 3 introduces a real port,
such as an authenticated profile repository. Until then, this directory remains
documentation-only by design.
