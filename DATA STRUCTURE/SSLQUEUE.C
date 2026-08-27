#include <stdio.h>
#include <conio.h>
#include <stdlib.h>

struct Node
{
    int data;
    struct Node *next;
};

struct Node *front = NULL;
struct Node *end = NULL;
int count = 0;

struct Node *createNode(int info)
{
    struct Node *node = (struct Node *)malloc(sizeof(struct Node));
    node->data = info;
    node->next = NULL;
    count += 1;
    return node;
}

void enQueue(int info)
{
    struct Node *node = createNode(info);
    if (front == NULL && end == NULL)
    {
        front = node;
        end = node;
    }
    else
    {
        end->next = node;
        end = node;
    }
}

void deQueue()
{
    if (front == NULL)
    {
        printf("\nQueue is Empty\n");
    }
    else
    {
        struct Node *temp;
        temp = front;
        front = front->next;
        
	if (front == NULL)
        {
            end = NULL;
        }
        free(temp);
        count -= 1;
    }
}

void display()
{
    struct Node *temp;
    temp = front;
    if (front == NULL)
    {
        printf("Queue is Empty");
    }
    else
    {
        while (temp != NULL)
        {
            printf("\t %d", temp->data);
            temp = temp->next;
        }
    }
}

void main()
{
    int choice, data, exit = 0;
    clrscr();
    do
    {
	printf("\n\nQueue using Linked List\n\n");
	printf("1.  EnQueue\n");
	printf("2.  DeQueue\n");
	printf("3.  Display\n");
	printf("4.  Exit\n");
	printf("Enter Choice : ");
	scanf("%d", &choice);

	switch (choice)
	{
	case 1:
	    printf("Enter data : ");
	    scanf("%d", &data);
	    enQueue(data);
	    display();
	    break;

	case 2:
	    deQueue();
	    display();
	    break;

	case 3:
	    display();
	    break;

	case 4:
	    printf("\n\nExiting.........\n\n");
	    exit = 1;
	    break;

	default:
	    printf("\n\nInValid Choice\n\n");
	    break;
	}
    } while (exit != 1);
    fflush(stdin);
    getch();
}