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
var x = 5 // x is a new variable, and this is an inline comment.

val y = 6 /* y is a new constant,
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

Vectors, matrices, N-D arrays, tuples, and lists all use the same syntax, because they are all essentially one data type, just called matrices. Don't worry about the dynamic typing; if it is filled with numeric elements, it can behave as a matrix, list, tuple, or vector (if it's one dimensional). If it has non-numeric elements, it can behave as a list or a tuple. Of course, a matrix of floats and a matrix of strings are still distinguishable when it comes to type checking; we'll get to that later.

Note: there is a difference between a multi-dimensional matrix, and a nested matrix.

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

But wait, what about order of operations? Does `(2*3) + 4` evaluate to the scalar `10` or the matrix `(10)`? The short answer is don't worry about it. The long answer is: for efficiency, it will default to a scalar. But if you try to use any matrix operation on a scalar, it will be automatically converted to make it work. If you use a matrix with a single element as if it was unwrapped, it will be automatically unwrapped for you. I think that's pretty cool.

Functions are first class data types, and can be defined and redefined dynamically. The following function definitions behave identically:

```scala
fn foo(x) {
  x + 5
}

// Only possible if the function is a single statement.
fn foo(x) x + 5

val foo = fn(x) {
  x + 5
}
```

### Control flow

#### Blocks

Curly braces define blocks of code, and create a new scope. They can evaluate to the value of the last statement in the block, if it has one. Variable names can be shadowed without losing data if done inside a block.

Note: blocks are values in Hadron. All control structures (if, while, functions, etc) can only have a _single statement_. Of course, that statement can be a block that contains more statements.

```scala
val x = 5
{
  val y = x + 2
  println(y) // prints 7

  val x = x + 3 // x is shadowed
  println(x) // prints 8
}
// Error:
// println(y)
println(x) // prints 5

val z = {
  val x = 2
  x + 1
}
println(z) // prints 3
```

#### If Statements

are pretty straightforward. The condition of the statement must be separated from the body by a newline, a semicolon, or by enclosing one or both in a block. If statements (and all other control flow) implicitly define new scopes in the body.

```scala
if x < 5 {
  // do things
} else if x < 10 {
  // do things
} else {
  // do things
}

if x < 5
  println("is true")
else
  println("is false")

// One liner
if x < 5; println("case 1") else if {x < 10} println("case 2") else println("case 3")
```

#### Loops

While loops act like you'd expect. Also, I stole the `loop` keyword from Rust, which is basically just `while true`.

```scala
var i = 0
while i < 10 {
  println(i)
  i += 1
}

loop
  println("Hello World!")
```

For loops use a unique syntax for enumeration. Let's build up to it. The following is for loop where the results of the iteration are inaccessible:

```scala
for 5:8
  println("I have no idea what I'm iterating over")
```

The `5:8` is a range operation, which behaves similarly to MatLab's range operator. It evaluates to a generator that creates the matrix `(5, 6, 7, 8)` one element at a time; and will be converted to the full matrix if you try to use it as one.

The above loop knowledge of the data it's iterating over. To access values, use:

```scala
for 5:8 as x
  print(x)
// prints 5678
```

Using the `as` keyword lets you access values, but not mutate them; so `x` in the above code is a variable, not a constant. To know where you are in the loop, use:

```scala
for 5:8 at i
  print(i)
// prints 0123
```

Note that Hadron is 0-indexed, despite the heavy focus on matrices.

Of course, the two syntaxes can be combined in either order:

```scala
var mutate_me = 1:4

// Add one to each element
for mutate_me as x at i
  mutate_me(i) = x + 1

// Replace each element with its factorial, just cuz
for mutate_me at i as x
  mutate_me(i) = x!
```

For matrices with multiple dimensions, the `at` clause produces tuples giving the coordinates (row, column). For example:

```scala
for (
  1, 2;
  3, 4
) as x at i {
  println(x + ": " + i)
}
/* Prints:
1: (0, 0)
2: (1, 0)
3: (0, 1)
4: (1, 1)
*/
```

Note that Hadron indexes and iterates in row-major order.

Do-while loops, strictly speaking, don't exist in Hadron. But since blocks can be placed _anywhere_, even as the while loop condition, we can bodge a do-while loop without much effort:

```scala
var x = 3
while {
  // this is always evaluated at least once
  println(x)
  x > 0 // the last statement is the loop condition
} {
  x -= 1
}
/* Prints:
3
2
1
0
*/
```

#### Continue, break, return, and yield

are not keywords in Hadron. Instead, Hadron uses a unique syntax that, admittedly, might be a terrible idea. We'll see.

A left arrow (hairpin followed by one or more dashes) continues out of a block. Multiple dashes mean it will attempt to continue out of the corresponding number of blocks. Note that this _completely ignores loops_, and so continuing out of a block inside a loop will only cut the block short, not the loop.

```scala
var x = 5
{
  if x == 5
    <-
  println("not five")
}
// prints nothing

{
  if x == 5 { // Note the extra block here
    <-
  }
  println("that was a useless continue")
  if x == 5 {
    // This one continues out of both blocks
    <--
  }
}

while x >= 0 {
  if x == 2; <-
  print(x)
  x -= 1
}
// prints 54310
```

A squiggly left arrow (hairpin followed by one or more tildes) breaks out of a loop. Note that this _completely ignores blocks_, and only looks for `loop`, `while`, or `for` statements.

```scala
for 0:5 as i {
  if i == 2; <-
  if i == 4; <~
  print(i)
}
// Prints 013

for 0:5 as i {
  for 0:5 as j {
    <-  // continues the inner loop
    <~  // breaks the inner loop
    <-- // continues the outer loop
    <~~ // breaks the outer loop
  }
}
```

To be continued <~
