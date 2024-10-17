// Pair lambda takes in two values, and returns another function that takes in
// A boolean. If its true, return head of pair, else return tail.
const pair = (x, y) => b => b ? x : y;
const head = pair => pair(true);
const tail = pair => pair(false);

// Store both directions of the tape.
const forward_tape = pair(0, undefined);
const backward_tape = pair(0, undefined);
const tape = pair(forward_tape, backward_tape);

// Returns byte at current pointer
const curr_byte = tape => {
  return head(head(tape));
};

// Go to start of tape (only used for display_tape)
const start_tape = tape => {
  const forward_tape = head(tape);
  const backward_tape = tail(tape);

  if (is_undefined(tail(backward_tape))) {
    return tape;
  }
  else {
    return start_tape(pair(
      pair(head(tail(backward_tape)), forward_tape),
      tail(backward_tape)
    ));
  }
};

// Displays the whole tape for debugging purposes
const display_tape = tape => {
  const start = start_tape(tape);

  const helper = (forward_tape, display_buffer) => {
    if (is_undefined(tail(forward_tape))) {
      return display_buffer;
    }
    else {
      return helper(tail(forward_tape), display_buffer + ',' + stringify(head(tail(forward_tape))));
    }
  };

  display('[' + helper(head(start), stringify(curr_byte(start))) + ']');
};

// Increments current value at pointer
const increment = tape => {
  const forward_tape = head(tape);
  const backward_tape = tail(tape);
  return pair(
    pair(head(forward_tape) + 1, tail(forward_tape)),
    pair(head(backward_tape) + 1, tail(backward_tape))
  );
};

// Decrements current value at pointer
const decrement = tape => {
  const forward_tape = head(tape);
  const backward_tape = tail(tape);
  return pair(
    pair(head(forward_tape) - 1, tail(forward_tape)),
    pair(head(backward_tape) - 1, tail(backward_tape))
  );
};

// Move pointer to right
const move_right = tape => {
  const forward_tape = head(tape);
  const backward_tape = tail(tape);

  // If reach end of tape, make more tape :)
  if (is_undefined(tail(forward_tape))) {
    return pair(
      pair(0, undefined),
      pair(0, backward_tape)
    );
  }
  else {
    return pair(
      tail(forward_tape),
      pair(head(tail(forward_tape)), backward_tape)
    );
  }
};

// Move pointer to left
const move_left = tape => {
  const forward_tape = head(tape);
  const backward_tape = tail(tape);

  // If reach start of tape, make more tape :)
  if (is_undefined(tail(backward_tape))) {
    return pair(
      pair(0, forward_tape),
      pair(0, undefined)
    );
  }
  else {
    return pair(
      pair(head(tail(backward_tape)), forward_tape),
      tail(backward_tape)
    );
  }
};

// Displays the ascii representation of the current byte, only for 0-255
const display_byte = tape => {
  return char_at(ascii, curr_byte(tape));
};

// Takes an input, validates its a number, and stores the value in the current byte
const input_byte = tape => {
  const forward_tape = head(tape);
  const backward_tape = tail(tape);

  const input = parse_int(prompt("Input an integer, cancel to quit program"), 10);
  // Do this to check for NaN
  if (input > 0 || input <= 0) {
    return pair(
      pair(input, tail(forward_tape)),
      pair(input, tail(backward_tape))
    );
  }
  else {
    error('Not a number');
  }
};

const ascii = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\x0c\r\x0e\x0f\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7f\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8a\x8b\x8c\x8d\x8e\x8f\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9a\x9b\x9c\x9d\x9e\x9f\xa0¡¢£¤¥¦§¨©ª«¬\xad®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ';

// program: BF code
// program_ptr: pointer to current character of program
// tape: self explanatory
// display_buffer: buffer byte displays until it hits a new line or input 
// jmp_close: if greater than 0, ignore all characters except for '[' and ']'
// If hit '[', add by one and move to the next character, if hit ']', subtract
// by one and move on to next character. 
// jmp_open: same logic as above, but move backwards and add on ']' and subtract
// on '['
// count: for debugging purposes
const main = (program, program_ptr, tape, display_buffer, jmp_close, jmp_open, count) => {
  // if (count === 100) {
  //     return 0;
  // } else {}
  const curr = char_at(program, program_ptr);

  // If curr is undefined, reach end of program, flush display_buffer
  if (is_undefined(curr)) {
    if (display_buffer !== '') {
      display(display_buffer);
    } else { }
    return 'Reached end of program';
  }
  // Check jmp_close and jmp_open
  else if (jmp_close > 0) {
    return main(program, program_ptr + 1, tape, display_buffer,
      jmp_close + ((curr === '[') ? 1 : (curr === ']') ? -1 : 0),
      jmp_open, count + 1
    );
  }
  else if (jmp_open > 0) {
    const temp = jmp_open + ((curr === ']') ? 1 : (curr === '[') ? -1 : 0);
    return main(program, program_ptr + (temp === 0 ? 0 : -1), tape, display_buffer,
      jmp_close, temp, count + 1
    );
  }
  // Start interpreting program
  else if (curr === '+') {
    return main(program, program_ptr + 1, increment(tape), display_buffer, jmp_close, jmp_open, count + 1);
  }
  else if (curr === '-') {
    return main(program, program_ptr + 1, decrement(tape), display_buffer, jmp_close, jmp_open, count + 1);
  }
  else if (curr === '<') {
    return main(program, program_ptr + 1, move_left(tape), display_buffer, jmp_close, jmp_open, count + 1);
  }
  else if (curr === '>') {
    return main(program, program_ptr + 1, move_right(tape), display_buffer, jmp_close, jmp_open, count + 1);
  }
  else if (curr === '.') {
    // Add to display buffer but flush on new line
    if (curr_byte(tape) === 10) {
      display(display_buffer);
      return main(program, program_ptr + 1, tape,
        '',
        jmp_close, jmp_open, count + 1
      );
    } else { }
    return main(program, program_ptr + 1, tape,
      display_buffer + display_byte(tape),
      jmp_close, jmp_open, count + 1
    );
  }
  else if (curr === ',') {
    // Flush display buffer on input
    if (display_buffer !== '') {
      display(display_buffer);
    } else { }
    return main(program, program_ptr + 1, input_byte(tape), '',
      jmp_close, jmp_open, count + 1
    );
  }
  else if (curr === '[') {
    return main(program, program_ptr + 1, tape, display_buffer,
      jmp_close + ((curr_byte(tape) === 0) ? 1 : 0), jmp_open, count + 1
    );
  }
  else if (curr === ']') {
    const curr_byte_non_zero = curr_byte(tape) !== 0;
    const temp = program_ptr + (curr_byte_non_zero ? -1 : 1);
    if (temp < 0) {
      error('Could not find matching opening brace');
    }
    else {
      return main(program, temp, tape, display_buffer, jmp_close,
        jmp_open + (curr_byte_non_zero ? 1 : 0), count + 1
      );
    }
  }
  else {
    return main(program, program_ptr + 1, tape, display_buffer, jmp_close, jmp_open, count + 1);
  }
};
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
[
This program asks for user input, if the input is A-Z or a-z in ascii, it applies rot_13 to the input and prints it.
]
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

main(hello_world, 0, tape, '', 0, 0, 0);

