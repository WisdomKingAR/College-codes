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
int count=0;

struct Node* createNode(int info)
{
	struct Node* node = (struct Node*) malloc(sizeof(struct Node));
	node -> data = info;
	node -> next = NULL;
	count+=1;
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
void addAtPosition(int info,int pos)
{
	int i;
	if(pos == 0)
	{
		addAtBegin(info);
	}
	else if(pos == (count+1))
	{
		addAtEnd(info);
	}
	else
	{
		struct Node* p;
		struct Node* q;
		node = createNode(info);
		p=list;
		q=list;
		for(i=0;i<pos;i++)
			{
			p=q;
			q=q->next;
			}
		p->next=node;
		node->next=q;
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
		count-=1;
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
		count-=1;
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
		count-=1;
		free(temp);
	}
}
void deleteAtPosition(int pos)
{
	int i;
	if(pos==0)
	{
		deleteAtBegin();
	}
	else if (pos == count)
	{
		deleteAtEnd();
	}
	else
	{
		struct Node* p;
		struct Node* temp;
		p=list;
		temp=list;
		for(i=0;i<pos;i++)
			{
			p=temp;
			temp=temp->next;
			}
		p->next=temp->next;
		count-=1;
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
	int choice,data,exit=0,pos;
	clrscr();
	do
	{
	printf("\n\nLinked List\n\n");
	printf("1.  Add node at Begin\n");
	printf("2.  Add node at End\n");
	printf("3.  Add at Position\n");
	printf("4.  Delete node at Begin\n");
	printf("5.  Delete node at End\n");
	printf("6.  Delete at Position\n");
	printf("7.  Search Node\n");
	printf("8.  Search and Delete\n");
	printf("9.  Display\n");
	printf("10. Exit\n");
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
		printf("Enter data : ");
		scanf("%d",&data);
		printf("Enter Position : ");
		scanf("%d",&pos);
		addAtPosition(data,pos);
		display();
	  }
	  break;
	  case 4:
	  {
		deleteAtBegin();
		display();
	  }
	  break;
	  case 5:
	  {
		deleteAtEnd();
		display();
	  }
	  break;
	  case 6:
	  {
		printf("Enter the position : ");
		scanf("%d",&pos);
		deleteAtPosition(pos);
		display();
	  }
	  break;
	  case 7:
	  {}
	  break;
	  case 8:
	  {}
	  break;
	  case 9:
	  {
		display();
	  }
	  break;
	  case 10: exit=1;
	 }
	}while(exit!=1);
	fflush(stdin);
	getch();
}
