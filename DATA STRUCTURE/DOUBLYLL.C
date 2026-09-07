#include<stdio.h>
#include<conio.h>
#include<stdlib.h>
#include<string.h>
#include<time.h>
struct Node
{
	int data;
	struct Node *next;
	struct Node *prev;
};

struct Node *node;
struct Node *list=NULL;
struct Node *last=NULL;
int count=0;

struct Node* createNode(int info)
{
	struct Node* node =(struct Node*)malloc(sizeof(struct Node));
	node->data=info;
	node->next=NULL;
	node->prev=NULL;
	count+=1;
	return node;
}
void insertAtBegin(int info)
{
	node = createNode(info);
	if(list == NULL)
	{
		list=node;
		last=node;
	}
	else
	{
		node->next=list;
		list->prev=node;
		list=node;
	}
}
void insertAtEnd(int info)
{
	node=createNode(info);
	if(list==NULL)
	{
		list = node;
		last = node;
	}
	else
	{
		last->next=node;
		node->prev=last;
		last=node;
	}
}
void deleteAtBegin()
{
	if(list == NULL)
	{
		printf("\nlist is empty\n");
	}
	else if(list->next == NULL)
	{
		list = NULL;
		last = NULL;
	}
	else
	{
		struct Node *temp = list;
		list = list ->next;
		list->prev=NULL;
		free(temp);
		count-=1;
	}
}
void deleteAtEnd()
{
	if(list == NULL)
	{
		printf("\nlist is empty\n");
	}
	else if (list->next == NULL)
	{
		list = NULL;
		last = NULL;
	}
	else
	{
		struct Node *temp=last;
		last=last->prev;
		last->next=NULL;
		free(temp);
		count-=1;
	}
}
void display()
{
	struct Node *temp=list;
	while(temp != NULL)
	{
		printf("%d\t",(temp->data));
		temp=temp->next;
	}
}
void displayReverse()
{
	struct Node *temp=last;
	while(temp != NULL)
	{
		printf("%d\t",(temp->data));
		temp=temp->prev;
	}
}
void main()
{
	int choice,info,exit=0;
	clrscr();
	while(exit!=1)
	{
		printf("\n\n============Doubly Linked List============\n");
		printf("1. Add at Begin\n");
		printf("2. Add at End\n");
		printf("3. Delete from Begin\n");
		printf("4. Delete from End\n");
		printf("5. Display\n");
		printf("6. Display in Reverse order\n");
		printf("9. Exit");
		printf("\nEnter the operation u need to perform : ");
		scanf("%d",&choice);
		switch(choice)
		{
			case 1:{
				printf("\nEnter the data : ");
				scanf("%d",&info);
				insertAtBegin(info);
				display();
				}
			break;
			case 2:{
				printf("\nEnter the data : ");
				scanf("%d",&info);
				insertAtEnd(info);
				display();
				}
			break;
			case 3:{
				deleteAtBegin();
				display();
				}
			break;
			case 4:{
				deleteAtEnd();
				display();
				}
			break;
			case 5:{
				display();
				}
			break;
			case 6:{
				displayReverse();
				}
			break;
			case 9: exit=1;
			break;
			default : printf("\nInValid Choice\n");
		}
		fflush(stdin);
	}
	getch();
}