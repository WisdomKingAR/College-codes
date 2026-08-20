#include<stdio.h>
#include<conio.h>
#define MAX 5
int Lqueue[MAX];
int f=-1;
int r=-1;

void enqueue(int data)
{
	if(r==(MAX-1))//Queue Full
	{
		printf("\nQueue Overflow\n");
	}
	else if(f==-1 && r==-1)//Queue Start
	{
		f=0;
		r=0;
		Lqueue[r]=data;
	}
	else
	{
		Lqueue[++r]=data;
	}
}
void dequeue()
{
	if(f==-1)//Queue Empty
	{
		printf("\nQueue Underflow\n");
	}
	else if(f==r)//Last element removed
	{
		printf("DeQueued : %d\n",Lqueue[f]);
		f=r=-1;
	}
	else
	{
		printf("DeQueued : %d\n",Lqueue[f++]);
	}
}
void queuefront()
{
	printf("%d\n",Lqueue[f]);
}
void queuerear()
{
	printf("%d\n",Lqueue[r]);
}
void display()
{
	int i;
	if(f==-1)
		{
		printf("\nQueue is Empty\n");
		}
	else
	{
		for(i=f;i<=r;i++)
		{
		printf("[ %d ]",Lqueue[i]);
		}
	}
}
void main()
{
	int n,opt,exit=0;
	clrscr();
	while(exit!=1)
	{
		printf("\n\nLinear Queue Operation\n\n");
		printf("1. EnQueue\n");
		printf("2. DeQueue\n");
		printf("3. QueueFront\n");
		printf("4. QueueRear\n");
		printf("5. Exit\n");
		printf("\nEnter the value of the operation to perform : ");
		scanf("%d",&opt);
		switch(opt)
		{
		case 1:
			{
			printf("\nEnter the value to add in queue : ");
			scanf("%d",&n);
			enqueue(n);
			display();
			}
		break;
		case 2:{
			dequeue();
			display();
			}
		break;
		case 3: queuefront();
		break;
		case 4: queuerear();
		break;
		case 5: exit = 1;
		break;
		default : printf("\nWrong Input");
		}
	}
	getch();
}