cmake_minimum_required(VERSION 3.25)

project(bare_signals C)

include(bare)

add_bare_module(bare_signals)

target_sources(
  ${bare_signals}
  PRIVATE
    binding.c
)
