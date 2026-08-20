#include<stdio.h>
#include<conio.h>
#define MAX 6
int Cqueue[MAX];
int f=-1;
int r=-1;

void enqueue(int data) {
    if ((r + 1) % MAX == f) { // Queue Full Condition
        printf("\nQueue Overflow\n");
    } 
    else if (f == -1 && r == -1) { // Inserting First Element
        f = 0;
        r = 0;
        Cqueue[r] = data;
    } 
    else { // Standard Insertion
        r = (r + 1) % MAX;
        Cqueue[r] = data;
    }
}

void dequeue() {
    if (f == -1 && r == -1) { // Queue Empty Condition
        printf("\nQueue Underflow\n");
    } 
    else if (f == r) { // Only one element was left, now empty
        printf("DeQueued : %d\n", Cqueue[f]);
        f = -1;
        r = -1;
    } 
    else { // Standard Dequeue
        printf("DeQueued : %d\n", Cqueue[f]);
        f = (f + 1) % MAX;
    }
}

void queuefront() {
    if (f == -1) {
        printf("Queue is Empty\n");
    } else {
        printf("Front: %d\n", Cqueue[f]);
    }
}

void queuerear() {
    if (r == -1) {
        printf("Queue is Empty\n");
    } else {
        printf("Rear: %d\n", Cqueue[r]);
    }
}

void display() {
    int i;
    if (f == -1) {
        printf("\n\nQueue is Empty\n\n");
        return;
    }

    printf("Queue elements: ");
    if (f <= r) {
        for (i = f; i <= r; i++) {
            printf("[%d] ", Cqueue[i]);
        }
    } else {
        for (i = f; i < MAX; i++) {
            printf("[%d] ", Cqueue[i]);
        }
        for (i = 0; i <= r; i++) {
            printf("[%d] ", Cqueue[i]);
        }
    }
    printf("\n");
}

void main()
{
	int n,opt,exit=0;
	clrscr();
	while(exit!=1)
	{
		printf("\n\nCircular Queue Operation\n\n");
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