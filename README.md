# evolving-lsystems

Demonstration of an interactive genetic algorithm for evolving L-Systems.
Each colored pattern is drawn by a turtle controlled by a cyclical sequence of instructions.
The following instructions exist:

* "F" (Draw Forward): Moves forward one tile, drawing the path.
* "L" (Turn Left): Changes direction 90º to the left. 
* "R" (Turn Right): Changes direction 90º to the right. 
* "G" (Ghost Forward): Moves forward, without drawing. 
* "(" (Remember Position): Remembers this position in memory. 
* ")" (Recall Position): Returns to the last remembered position. 
* "[" (Remember Instruction Index): Remembers the current position in the sequence of instructions. 
* "]" (Recall Instruction Index): Returns to the last remembered index in the sequence of instructions. 

 Each turtle has an associated grammar and generates the sequence of instructions to follow by applying the rules of the grammar to an axiom 5 times.
The axiom used is "LFRF".
The alphabet for the grammar contains the symbols for each of the instructions.
All of the symbols are non-terminal.
The rules of the grammar have a head and a body.
The head is a single symbol, and the body is a sequence of up to 5 symbols.
An example rule would be "F &rarr; RFG", meaning that every "F" in the sequence gets replaced by the symbols "RFG".

Grammars are defined as a collection of these rules, and are made so that new rules can be added.
If a grammar has multiple rules with the same head, only the last one to have been added applies, effectively obfuscating previous rules.
Each turtle starts with a grammar made up of a single random rule.
By selecting one of the turtles with the colored buttons, the other two turtles change their grammar to a copy of the one belonging to the selected turtle.
This means that at any point in time, the three turtles only differ their behaviour by one rule.
However, since rules have a rippling effect, this can lead to drastic changes in the generated patterns.
By selecting patterns that you like, you can effectively guide the system into generating patterns that you will preffer, as the rules from the patterns you select will be carried over into the new patterns.