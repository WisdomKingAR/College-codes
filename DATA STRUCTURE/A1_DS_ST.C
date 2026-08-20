#include<stdio.h>
#include<conio.h>
#define max 4
int stack[4];
int tos=-1;

void push(int n)
	{
	if(tos == (max-1))
		{
		printf("Stack Overflow\n");
		}
	else
		{
		stack[++tos]=n;
		printf("%d pushed\n",n);
		}
	}

void pop()
	{
	if(tos == -1)
		{
		printf("Stack Underflow\n");
		}
	else
		{
		printf("%d popped\n",stack[tos--]);
		}
	}

void main()
	{
	int n,opt,exit =0;
	clrscr();
	while(exit != 1)
	{
		printf("stack operation\n");
		printf("1. push\n");
		printf("2. pop\n");
		printf("3. exit\n");
		printf("enter the value of the operation to perform : ");
		scanf("%d",&opt);
		switch(opt)
		{
			case 1:{
				printf("Enter the value to be pushed : ");
				scanf("%d",&n);
				push(n);
				}
			break;
			case 2:pop();
			break;
			case 3:exit =1;
			break;
			default : printf("\nwrong value entered\n");
		}
	}
	getch();
	}
