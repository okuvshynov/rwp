; MIT License
; Refer to /LICENSE file for full text
; Copyright (c) 2019 Oleksandr Kuvshynov
;
;
; LOAD_BLOCK.OVERLAP_STORE
;
; This event fires in several cases, one of which is:
; - some of the bytes being loaded were stored by a previous instruction, 
; but some were not.
; Linux perf event: r0803
;
; TODO: add alignment-related example
;       Example:
;
; $ nasm -felf64 sample.asm && ld sample.o && time ./a.out
; $ sudo perf stat -e cycles,r0803 ./a.out 

global _start

section .text

_start: xor eax, eax
        xor ebx, ebx
        xor ecx, ecx
        xor edx, edx

loop:   mov dword [buffer], ecx
        mov rdx, [buffer] ; in this case, part of the loaded data was modified.
      ; mov edx, [buffer] ; in this case, we do not get the same problem - 
                          ; load and store are exact same thing. Storing qword
                          ; will also help.
                                
        add ecx, 42
        jc done           ; 2^31 / 42 iterations
        jmp loop          ;

done:   mov rax, 60       ; exit system call
        xor rdi, rdi      ; return code == 0
        syscall

section .bss
buffer: resb    128
