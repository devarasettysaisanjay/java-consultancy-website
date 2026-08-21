import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  

  loginData = {
    email: '',
    password: ''
  };

  constructor() {}

  login(): void {

    console.log('Email:', this.loginData.email);
    console.log('Password:', this.loginData.password);

    if (!this.loginData.email || !this.loginData.password) {
      alert('Please enter email and password');
      return;
    }

    // Connect your Spring Boot API here
    //
    // Example:
    //
    // this.api.login(this.loginData).subscribe({
    //
    //   next: (response) => {
    //     console.log(response);
    //     this.router.navigate(['/dashboard']);
    //   },
    //
    //   error: (error) => {
    //     alert('Invalid email or password');
    //   }
    //
    // });
  }

  typedCode: string = '';

javaCode: string[] = [
  'public class HelloWorld {',
  '    public static void main(String[] args) {',
  '        System.out.println("Welcome to Java!");',
  '        int x = 10;',
  '        int y = 20;',
  '        int sum = x + y;',
  '        System.out.println("Sum = " + sum);',
  '    }',
  '}'
];

currentLine: number = 0;
currentCharacter: number = 0;


ngOnInit(): void {

  // Keep your existing ngOnInit code here

  this.startTyping();
}
startTyping(): void {

  // Clear previous code
  this.typedCode = '';

  // Start from first line
  this.currentLine = 0;

  this.currentCharacter = 0;

  // Start typing
  this.typeNextCharacter();

}


typeNextCharacter(): void {

  // Check if entire program is completed
  if (this.currentLine >= this.javaCode.length) {

    // Wait 2 seconds after completing the program
    setTimeout(() => {

      // Start again from the beginning
      this.startTyping();

    }, 2000);

    return;
  }


  // Current line
  const currentText =
    this.javaCode[this.currentLine];


  // Type current character
  if (
    this.currentCharacter <
    currentText.length
  ) {

    this.typedCode +=
      currentText[this.currentCharacter];

    this.currentCharacter++;


    // Typing speed
    setTimeout(() => {

      this.typeNextCharacter();

    }, 45);

  }

  else {

    // Current line completed
    this.typedCode += '\n';

    // Move to next line
    this.currentLine++;

    this.currentCharacter = 0;


    // Small pause before next line
    setTimeout(() => {

      this.typeNextCharacter();

    }, 300);

  }
}

}
