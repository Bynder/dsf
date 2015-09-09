# DSF
Decent String Formatter for Javascript

## Installation

Install with bower  
`bower install DecentStringFormatter`   

or install with NPM  
`npm install decentstringformatter`

## Usage  

`var translation = "Created on {}, changed on {} (by {}).";  
var formatted = translation.dsf("{test}",  
                                   "09-09-2015",  
                                   "User");`
