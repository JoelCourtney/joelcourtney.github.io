---
title: Hadron
permalink: /hadron
---
# The Hadron Programming Language
is a scripting language designed for physical and numerical computation. [The interpreter](https://github.com/JoelCourtney/hadron) uses [ANTLR](https://www.antlr.org/), [Truffle](https://github.com/oracle/graal/tree/master/truffle) and the [GraalVM](https://www.graalvm.org/), and is still in progress.

---

## Features

- Matrices and matrix operations a. la. MatLab
- Native support for units and dimension types
- Easy foreign language interop with Truffle
- Complex numbers and big integers

---

## Syntax

The grammar currently used in the [interpreter's repo](https://github.com/JoelCourtney/hadron) is not indicative of Hadron's syntax, as it still has elements from Oracle's [SimpleLanguage](https://github.com/graalvm/simplelanguage) grammar.

After the interpreter itself is complete, I'll make a pull request to [Rouge](https://github.com/rouge-ruby/rouge) to have Hadron properly highlighted in the code blocks below.

### Variables, constants, and comments

Statements in Hadron are delimited by either a newline or a semicolon (or both, if you're feeling excessive). Variables can be created as follows:

```scala
let x = 5 // x is a new variable, and this is an inline comment.

let y := 6 /* y is a new constant,
  and this is a block comment */
```

### Value literals and primitive data types

Hadron's primitive types are: booleans, integers (arbitrary precision), floats (double precision), strings, matrices, and functions.

```scala
// booleans
true; false

// integers
5; -2
1000000000000000000000000000000 // if you so desired

// floats
1.1; 1.; .5; -.5
3e6; 3E6; 3.2e-6 // with scientific notation

// You can use percents too
15%; 2.4%; 150%

// strings
"Hello World!"
// 'single quoted strings aren't allowed for now.'
```

Vectors, matrices, N-D arrays, tuples, and lists all use the same syntax, because they are all one data type, just called matrices. Don't worry about the dynamic typing; if it is filled with numeric elements, it can behave as a matrix, list, tuple, or vector (if it's one dimensional). If it has non-numeric elements, it can behave as a list or a tuple.

Note: there is a difference between a multi-dimensional list, and a nested list.

```scala
(1, 2, 3) // Row vector

(1; 2; 3) // Column vector
(1, 2, 3)' // Equivalent column vector, using the transpose operator

(1, 0; 0, 1) // Matrix

(true, 1, "asdf", 2%) // List

(true, 1; "asdf", 2%) // Multi-dimensional list

/*
 * Note: the following values are NOT the same.
 * While matrices and nested lists are conceptually similar,
 * nested lists will not preform matrix operations correctly.
 *
 * It stands to reason that I will include a flatten-esque built-in function
 * for converting between the two.
 */

( // This is a matrix
  1, 2, 3;
  4, 5, 6;
  7, 8, 9
)

( // This is a nested list
  (1, 2, 3),
  (4, 5, 6),
  (7, 8, 9)
)
```
