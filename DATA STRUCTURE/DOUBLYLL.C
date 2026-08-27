#include <stdio.h>
#include <conio.h>
#include <stdlib.h>

struct Node
{
	int data;
	struct Node *next;
	struct Node *prev;
};

struct Node *node;
struct Node *list;
struct Node *last;
int count = 0;

struct Node *createNode(int info)
{
	struct Node *node = (struct Node *)malloc(sizeof(struct Node));
	node->data = info;
	node->next = NULL;
	node->prev = NULL;
	count += 1;
	return node;
}

void addAtBegin(int info)
{
	node = createNode(info);
	if (list == NULL)
	{
		list = node;
		last = node;
	}
	else
	{
		list->prev=node;
		node->next = list;
		list = node;
	}
}
void addAtEnd(int info)
{
	node = createNode(info);
	if (list == NULL)
	{
		list = node;
		last = node;
	}
	else
	{
		last->next = node;
		node->prev = last;
		last = node;
	}
}
void addNodeAfter(int info, int nodeValue)
{
	if (list == NULL)
	{
		list=node;
		last=node;
	}
	else
	{
		struct Node *temp;
		temp=list;
		while(temp!=NULL)
			{
				if(temp->data == nodeValue)
					{
						break;
					}
				temp=temp->next;
			}
		if(temp == NULL)
			{
				printf("\nNode Value not available\n");
			}
		else
			{
				node->prev=temp;
				temp=temp->next;
				node->next=temp;
				temp->prev=node;
				temp=node;
				temp=temp->prev;
				temp->next=node;
			}
	}
}
void deleteAtBegin()
{
	if (list == NULL)
	{
		printf("\nList is Empty\n");
	}
	else
	{
		struct Node *temp;
		temp = list;
		list = list->next;
		list -> prev = NULL;
		free(temp);
		if (list == NULL)
		{
			last = NULL;
		}
		count -= 1;
	}
}
void deleteAtEnd()
{
	if (list == NULL)
	{
		printf("\nList is Empty\n");
	}
	else
	{
		struct Node *temp;
		temp=last;
		last=last->prev;
		last->next=NULL;
		count -= 1;
		free(temp);
	}

}
void searchNode(int key)
{
	struct Node *temp;
	int pos = 0;
	int found = 0;
	temp = list;
	while (temp != NULL)
	{
		if (temp->data == key)
		{
			printf("\nElement %d found at position %d\n", key, pos);
			found = 1;
			break;
		}
		temp = temp->next;
		pos += 1;
	}
	if (found == 0)
		printf("\nElement %d not found in the list\n", key);
}
void display()
{
	struct Node *temp;
	temp = list;
	if (list == NULL)
	{
		printf("List is Empty");
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
	int choice, data, exit = 0, pos;
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
		printf("10. Rotate List\n");
		printf("11. Remove Duplicates\n");
		printf("12. Exit\n");
		printf("Enter Choice : ");
		scanf("%d", &choice);
		switch (choice)
		{
		case 1:
		{
			printf("Enter data : ");
			scanf("%d", &data);
			addAtBegin(data);
			display();
		}
		break;
		case 2:
		{
			printf("Enter data :");
			scanf("%d", &data);
			addAtEnd(data);
			display();
		}
		break;
		case 3:
		{
			printf("Enter data : ");
			scanf("%d", &data);
			printf("Enter Position : ");
			scanf("%d", &pos);
			addAtPosition(data, pos);
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
			scanf("%d", &pos);
			deleteAtPosition(pos);
			display();
		}
		break;
		case 7:
		{
			printf("Enter element to search : ");
			scanf("%d", &data);
			searchNode(data);
		}
		break;
		case 8:
		{
			printf("Enter element to search and delete : ");
			scanf("%d", &data);
			searchNodeAndDelete(data);
			display();
		}
		break;
		case 9:
		{
			display();
		}
		break;
		case 10:
		{
			printf("Enter number of positions to rotate : ");
			scanf("%d", &pos);
			rotateList(pos);
			display();
		}
		break;
		case 11:
		{
			removeDuplicates();
			display();
		}
		break;
		case 12:
			exit = 1;
		}
	} while (exit != 1);
	fflush(stdin);
	getch();
}#include<stdio.h>
#include<conio.h>
#include<stdlib.h>

struct Node
{
	int data;
	struct Node *prev;
	struct Node *next;
}

