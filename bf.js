const factorial = `
+++++++++++++++++++++++++++++++++			c1v33 : ASCII code of !
>++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++				c2v61 : ASCII code of =
>++++++++++						c3v10 : ASCII code of EOL
>+++++++						c4v7  : quantity of numbers to be calculated
>							c5v0  : current number (one digit)
>+							c6v1  : current value of factorial (up to three digits)
<<							c4    : loop counter
[							block : loop to print one line and calculate next
>++++++++++++++++++++++++++++++++++++++++++++++++.	c5    : print current number
------------------------------------------------	c5    : back from ASCII to number
<<<<.-.>.<.+						c1    : print !_=_

>>>>>							block : print c6 (preserve it)
>							c7v0  : service zero
>++++++++++						c8v10 : divizor
<<							c6    : back to dividend
[->+>-[>+>>]>[+[-<+>]>+>>]<<<<<<]			c6v0  : divmod algo borrowed from esolangs; results in 0 n d_n%d n%d n/d
>[<+>-]							c6    : move dividend back to c6 and clear c7
>[-]							c8v0  : clear c8

>>							block : c10 can have two digits; divide it by ten again
>++++++++++						c11v10: divizor
<							c10   : back to dividend
[->-[>+>>]>[+[-<+>]>+>>]<<<<<]				c10v0 : another divmod algo borrowed from esolangs; results in 0 d_n%d n%d n/d
>[-]							c11v0 : clear c11
>>[++++++++++++++++++++++++++++++++++++++++++++++++.[-]]c13v0 : print nonzero n/d (first digit) and clear c13
<[++++++++++++++++++++++++++++++++++++++++++++++++.[-]] c12v0 : print nonzero n%d (second digit) and clear c12
<<<++++++++++++++++++++++++++++++++++++++++++++++++.[-]	c9v0  : print any n%d (last digit) and clear c9

<<<<<<.							c3    : EOL
>>+							c5    : increment current number
							block : multiply c6 by c5 (don't preserve c6)
>[>>+<<-]						c6v0  : move c6 to c8
>>							c8v0  : repeat c8 times
[
<<<[>+>+<<-]						c5v0  : move c5 to c6 and c7
>>[<<+>>-]						c7v0  : move c7 back to c5
>-
]
<<<<-							c4    : decrement loop counter
]
`;

const hello_world = "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.";

const rot_13 = `
-,+[                         Read first character and start outer character reading loop
    -[                       Skip forward if character is 0
        >>++++[>++++++++<-]  Set up divisor (32) for division loop
                               (MEMORY LAYOUT: dividend copy remainder divisor quotient zero zero)
        <+<-[                Set up dividend (x minus 1) and enter division loop
            >+>+>-[>>>]      Increase copy and remainder / reduce divisor / Normal case: skip forward
            <[[>+<-]>>+>]    Special case: move remainder back to divisor and increase quotient
            <<<<<-           Decrement dividend
        ]                    End division loop
    ]>>>[-]+                 End skip loop; zero former divisor and reuse space for a flag
    >--[-[<->+++[-]]]<[         Zero that flag unless quotient was 2 or 3; zero quotient; check flag
        ++++++++++++<[       If flag then set up divisor (13) for second division loop
                               (MEMORY LAYOUT: zero copy dividend divisor remainder quotient zero zero)
            >-[>+>>]         Reduce divisor; Normal case: increase remainder
            >[+[<+>-]>+>>]   Special case: increase remainder / move it back to divisor / increase quotient
            <<<<<-           Decrease dividend
        ]                    End division loop
        >>[<+>-]             Add remainder back to divisor to get a useful 13
        >[                   Skip forward if quotient was 0
            -[               Decrement quotient and skip forward if quotient was 1
                -<<[-]>>     Zero quotient and divisor if quotient was 2
            ]<<[<<->>-]>>    Zero divisor and subtract 13 from copy if quotient was 1
        ]<<[<<+>>-]          Zero divisor and add 13 to copy if quotient was 0
    ]                        End outer skip loop (jump to here if ((character minus 1)/32) was not 2 or 3)
    <[-]                     Clear remainder from first division if second division was skipped
    <.[-]                    Output ROT13ed character from copy and clear it
    <-,+                     Read next character
]                            End character reading loop
`;

const program = hello_world;

// Variables to store current character of program
let i = 0;
let curr = char_at(program, i);

// Variables for interpreter stuff
const commands = ['+', '-', '<', '>', '.', ',', '[', ']'];
let tape = [0];
let pointer = 0;

// List of all 256 ascii characters
const ascii = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\x0c\r\x0e\x0f\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7f\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8a\x8b\x8c\x8d\x8e\x8f\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9a\x9b\x9c\x9d\x9e\x9f\xa0¡¢£¤¥¦§¨©ª«¬\xad®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ';

// Store a display buffer so that everything is flushed at once when it hits an input or the end of the program
let display_buffer = '';

while (curr !== undefined) {
  // Check if current program character is a command
  // If it is a command, check which one it corresponds to
  if (curr === '+') {
    // Increment byte at pointer
    // Uncomment the line below if you want to allow overflow
    // tape[pointer] = tape[pointer] === 255 ? 0 : tape[pointer] + 1;
    tape[pointer] = tape[pointer] + 1;
  }
  else if (curr === '-') {
    // Decrement byte at pointer
    // Uncomment the line below if you want to allow underflow
    // tape[pointer] = tape[pointer] === 0 ? 255 : tape[pointer] - 1;
    tape[pointer] = tape[pointer] - 1;
  }
  else if (curr === '<') {
    // Move pointer left, expand tape if cannot move left
    if (pointer === 0) {
      const temp = [];
      const tape_length = array_length(tape);
      // Expand by length of list for amortized O(1)
      // Technically i could have just stored another array for the negative tape but im too lazy
      for (let j = 0; j < 2 * tape_length; j = j + 1) {
        temp[j] = j < tape_length ? 0 : tape[j - tape_length];
      }
      pointer = tape_length - 1;

      tape = temp;
    }
    else {
      pointer = pointer - 1;
    }
  }
  else if (curr === '>') {
    // Move pointer right, if out of range of list, assign 0
    pointer = pointer + 1;
    if (tape[pointer] === undefined) {
      tape[pointer] = 0;
    }
  }
  else if (curr === '.') {
    // Display current byte as ascii
    if (tape[pointer] === 10) {
      display(display_buffer);
      display_buffer = '';
    }
    else {
      display_buffer = display_buffer + char_at(ascii, tape[pointer]);
    }
  }
  else if (curr === ',') {
    if (display_buffer !== '') {
      display(display_buffer);
      display_buffer = '';
    }
    // Set the current byte at pointer to an input byte. 
    let input = prompt('Enter a number between 0-255 (inclusive), press cancel to stop the program');

    if (input === null) {
      break;
    }
    input = parse_int(input, 10)
    if (input === NaN || input < 0 || input > 255) {
      error('Invalid input');
    }
    else {
      tape[pointer] = input;
    }
  }
  else if (curr === '[') {
    if (tape[pointer] === 0) {
      let open = 1;
      while (open !== 0) {
        i = i + 1;
        curr = char_at(program, i);

        if (curr === undefined) {
          error('Could not find matching closing bracket');
          break;
        }
        if (curr === '[') {
          open = open + 1;
        }
        if (curr === ']') {
          open = open - 1;
        }
      }
    }
  }
  else if (curr === ']') {
    if (tape[pointer] !== 0) {
      let close = 1;
      while (close !== 0) {
        i = i - 1;
        if (i === -1) {
          error('Could not find matching opening bracket');
        }
        curr = char_at(program, i);

        if (curr === ']') {
          close = close + 1;
        }
        if (curr === '[') {
          close = close - 1;
        }
      }
    }
  }
  i = i + 1;
  curr = char_at(program, i);

  display(tape);
}

if (display_buffer !== '') {
  display(display_buffer);
}
