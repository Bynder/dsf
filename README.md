# DSF
Decent String Formatter for Javascript

## Installation

Install with bower  
`bower install DecentStringFormatter`   

or install with NPM  
`npm install decentstringformatter`

## Usage  

    var translation = "Created on {}, changed on {} (by {}).";
    var formatted = translation.dsf("some date", "09-09-2015", "User");

or

    var translation = "Created on {created_on}, changed on {updated_on} (by {updated_by}";
    var formatted = translation.dsf({
        'created_on': 'some date',
        'updated_on': '09-09-2015',
        'updated_by': 'User'
    });
