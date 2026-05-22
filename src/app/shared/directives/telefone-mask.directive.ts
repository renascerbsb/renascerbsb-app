import { Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTelefoneMask]'
})
export class TelefoneMaskDirective {
  constructor(
    private elementRef: ElementRef<HTMLInputElement>,
    @Optional() private ngControl: NgControl
  ) {}

  @HostListener('input')
  onInput(): void {
    this.aplicarMascara();
  }

  @HostListener('blur')
  onBlur(): void {
    this.aplicarMascara();
  }

  private aplicarMascara(): void {
    const input = this.elementRef.nativeElement;
    const valorFormatado = this.formatar(input.value);

    input.value = valorFormatado;
    this.ngControl?.control?.setValue(valorFormatado, { emitEvent: false });
  }

  private formatar(valor: string): string {
    const numeros = valor.replace(/\D/g, '').slice(0, 10);
    const ddd = numeros.slice(0, 2);
    const primeiraParte = numeros.slice(2, 6);
    const segundaParte = numeros.slice(6, 10);

    if (numeros.length <= 2) {
      return ddd ? `(${ddd}` : '';
    }

    if (numeros.length <= 6) {
      return `(${ddd}) ${primeiraParte}`;
    }

    return `(${ddd}) ${primeiraParte}-${segundaParte}`;
  }
}
