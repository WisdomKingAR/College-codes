#include <stdio.h>
#include <conio.h>
#include <stdlib.h>

struct Node
{
    int data;
    struct Node *next;
};

struct Node *node;
struct Node *list = NULL;
struct Node *last = NULL;
int count = 0;

struct Node *createNode(int info)
{
    struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));
    newNode->data = info;
    newNode->next = NULL;
    count += 1;
    return newNode;
}

void push(int info)
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
        last = node;
    }
}

void pop()
{
    if (list == NULL)
    {
        printf("\nList is Empty\n");
    }
    else if (list->next == NULL)
    {
        struct Node *tos;
        tos = list;
        list = NULL;
        last = NULL;
        printf("\nPopped: %d\n", tos->data);
        free(tos);
        count -= 1;
    }
    else
    {
        struct Node *tos;
        struct Node *p;
        tos = list;
        p = tos;
        while (tos->next != NULL)
        {
            p = tos;
            tos = tos->next;
        }
        p->next = NULL;
        last = p;
        count -= 1;
        printf("\nPopped: %d\n", tos->data);
        free(tos);
    }
}

void display()
{
    struct Node *tos;
    tos = list;
    if (list == NULL)
    {
        printf("\nList is Empty");
    }
    else
    {
        printf("\nStack: ");
        while (tos != NULL)
        {
            printf("\t%d", tos->data);
            tos = tos->next;
        }
    }
}

void peek()
{
    if (last == NULL)
    {
        printf("\nList is Empty\n");
    }
    else
    {
        printf("\nTop element: %d\n", last->data);
    }
}

void main()
{
    int choice, data, exit = 0;
    clrscr();
    
    do
    {
        printf("\n\nStack using Singly Linked List\n\n");
        printf("1.  Push\n");
        printf("2.  Pop\n");
        printf("3.  Peek\n");
        printf("4.  Display\n");
        printf("5.  Exit\n");
        printf("Enter Choice : ");
        scanf("%d", &choice);
        
        switch (choice)
        {
        case 1:
        {
            printf("Enter data : ");
            scanf("%d", &data);
            push(data);
            display();
        }
        break;
        case 2:
        {
            pop();
            display();
        }
        break;
        case 3:
        {
            peek();
        }
        break;
        case 4:
        {
            display();
        }
        break;
        case 5:
        {
            printf("\n\nExiting.........\n\n");
            exit = 1;
        }
        break;
        default:
        {
            printf("\n\nInValid Choice\n\n");
        }
        }
    } while (exit != 1);

    fflush(stdin);
    getch();
}