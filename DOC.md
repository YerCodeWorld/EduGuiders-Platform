# Main Concepts

- TSX files: The way we stack files (whatever their use) is cool and interesting. For example how we need to stack
a BrowserRouter on top of all within tags in order to enable routing. They act as a top layer that has methods and
code to achieve a desired functionality, being the child tags dependent on this.

## What are props?

Props are some sort of way of adding parameters to a variable or whatever are these gibberish syntax from javascript.
For them to work you need... OH. Props stand for properties. Dang it im stupid.
Anyways as I was saying for them to declare you component to be of type React.FC<{properties provider / property}
FC stands for function component

One must add default values to these properties when creating the component.


# ICONS

User the <i> tag for icons


# HTML, But no, TSX

This {  } embed in html code is cool. It allows conditional rendering and mapping. 
What other cool stuff can we do with it?

# createContext | useContext

We certainly know (specially from ModiText experience) that sometimes we have the need to pass some data
or information throughout multiple classes or files, in the form of parameters. Using createContext() helps
avoiding something called 'Prop Drilling' which is exactly that.

We basically just have a global data structure that we can import anywhere and use the data inside of it for
what we intend to use it. It may be no different from having a python dictionary that we import everywhere to
use the data inside of it instead of manually passing the information as parameters.

# useEffect

We will discuss this another time

# ReactNode

We can utilize ReactNode as a type when we want to embed another component or element 
inside a component as an argument