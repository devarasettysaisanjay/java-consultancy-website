import { Component, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-chatagent',
  templateUrl: './chatagent.component.html',
  styleUrls: ['./chatagent.component.css']
})
export class ChatagentComponent   {

   isOpen = false;

  message = '';

  userMessage = '';

  botResponse = '';


  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }


  sendMessage(): void {

    if (!this.message.trim()) {
      return;
    }

    this.userMessage = this.message;

    this.botResponse = this.getBotResponse(this.message);

    this.message = '';
  }


  sendQuickMessage(text: string): void {

    this.userMessage = text;

    this.botResponse = this.getBotResponse(text);
  }


  getBotResponse(message: string): string {

    const text = message.toLowerCase();


    if (
      text.indexOf('java training') !== -1 ||
      text.indexOf('java course') !== -1 ||
      text.indexOf('training') !== -1
    ) {
      return 'We provide Java training programs for beginners and experienced developers. Would you like to know about our courses?';
    }


    if (
      text.indexOf('course') !== -1 ||
      text.indexOf('courses') !== -1
    ) {
      return 'You can explore our Java courses and choose the program that best matches your career goals.';
    }


    if (
      text.indexOf('enquiry') !== -1 ||
      text.indexOf('enquire') !== -1
    ) {
      return 'Sure! Please visit our Enquiry page or provide your details and our team will contact you.';
    }


    if (
      text.indexOf('contact') !== -1 ||
      text.indexOf('phone') !== -1
    ) {
      return 'You can contact JavaBridgeConnect through our Contact Us page. Our team will be happy to assist you.';
    }


    if (
      text.indexOf('hello') !== -1 ||
      text.indexOf('hi') !== -1 ||
      text.indexOf('hey') !== -1
    ) {
      return 'Hello! 👋 Welcome to JavaBridgeConnect. How can I help you?';
    }


    return 'Thanks for contacting JavaBridgeConnect! Please select one of the options above or ask me about our Java training, courses, or consultancy services.';
  }
}
