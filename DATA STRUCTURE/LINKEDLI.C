#include<stdio.h>
#include<conio.h>
#include<stdlib.h>

struct Node
{
	int data;
	struct Node* next;
};

struct Node* node;
struct Node* list;
struct Node* last;

struct Node* createNode(int info)
{
	struct Node* node = (struct Node*) malloc(sizeof(struct Node));
	node -> data = info;
	node -> next = NULL;
	return node;
}

void addAtBegin(int info)
{
	node = createNode(info);
	if(list == NULL)
	{
		list=node;
		last=node;
	}
	else
	{
		node -> next =list;
		list = node;
	}
}
void addAtEnd(int info)
{
	node = createNode(info);
	if(list == NULL)
	{
		list=node;
		last=node ;
	}
	else
	{
		last->next=node;
		last=node;
	}
}
void deleteAtBegin()
{
	if(list == NULL)
	{
		printf("\nList is Empty\n");
	}
	else
	{
		struct Node* temp;
		temp = list;
		list = list -> next;
		free(temp);
		if(list == NULL)
			{
				last = NULL;
			}
	}
}
void deleteAtEnd()
{
	if(list == NULL)
	{
		printf("\nList is Empty\n");
	}
	else if (list->next == NULL) 
	{
		struct Node* temp;
		temp = list;
		list = NULL;
		last = NULL;
		free(temp);
	}
	else
	{
		struct Node* temp;
		struct Node* p;
		temp=list;
		p=temp;
		while(temp->next != NULL)
		{
			p=temp;
			temp=temp->next;
		}
		p->next = NULL;
		last = p;
		free(temp);
	}
}
void display()
{
	struct Node* temp;
	temp=list;
	if(list==NULL)
	{
		printf("List is Empty");
	}
	else
	{
		while(temp!=NULL)
			{
				printf("\t %d",temp->data);
				temp = temp -> next;
			}
	}
	free(temp);
}
void main()
{
	int choice,data,exit=0;
	clrscr();
	do
	{
	printf("\n\nLinked List\n\n");
	printf("1. Add node at Begin\n");
	printf("2. Add node at End\n");
	printf("3. Delete node at Begin\n");
	printf("4. Delete node at End\n");
	printf("5. Display\n");
	printf("6. Exit\n");
	printf("Enter Choice : ");
	scanf("%d",&choice);
	switch(choice)
	 {
	  case 1:
	  {
		printf("Enter data : ");
		scanf("%d",&data);
		addAtBegin(data);
		display();
	  }
	  break;
	  case 2:
	  {
		printf("Enter data :");
		scanf("%d",&data);
		addAtEnd(data);
		display();
	  }
	  break;
	  case 3:
	  {
		deleteAtBegin();
		display();
	  }
	  break;
	  case 4:
	  {
		deleteAtEnd();
		display();
	  }
	  break;
	  case 5:
	  {
		display();
	  }
	  break;
	  case 6: exit=1;
	 }
	}while(exit!=1);
	fflush(stdin);
	getch();
}
