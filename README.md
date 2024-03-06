# Alohomora 
#### password generator

## General info
In essence, this is just a glorified random ~~number~~ string generator, no fancy "true-random" libraries or anything like that used over here, who knows, maybe some day down the line.     
The final output is based on user input between various character groups (uppercase, lowercase, numbers, and symbols) and output length.

## Features 
* Similar looking characters have been removed e.g. I, l or 0, O
* Each character group has it's own colour formatting for easier identification
* Minimum password length is 16 characters for decent strength
* Copy to clipboard functionality (password itself and dedicated button)
* Inputs are reactive to user change
* Minor form validation (checkboxes "cannot" be unselected)
* Dark theme by default, light theme available with prefers-color-scheme: light

## Technologies
Created with:
* Vite
* HTML
* CSS
* TypeScript
