#include<stdio.h>
#include<conio.h>
#include<stdlib.h>
struct Node
{
	int data;
	struct Node *left;
	struct Node *right;
};
struct Node *root = NULL;
struct Node* insert(struct Node *r,int value)
{
	if(r==NULL)
	{
		r=(struct Node*)malloc(sizeof(struct Node));
		r->right=NULL;
		r->left=NULL;
		r->data=value;
	}
	else if(value < r->data)
	{
		r->left=insert(r->left,value);
	}
	else
	{
		r->right=insert(r->right,value);
	}
	return r;
}
void preOrder(struct Node *root)
{
	if(root!=NULL)
	{
		printf("%d\t",root->data);
		preOrder(root->left);
		preOrder(root->right);
	}
}
void inOrder(struct Node *root)
{
	if(root!=NULL)
	{
		inOrder(root->left);
		printf("%d\t",root->data);
		inOrder(root->right);
	}
}
void postOrder(struct Node *root)
{
	if(root!=NULL)
	{
		postOrder(root->left);
		postOrder(root->right);
		printf("%d\t",root->data);
	}
}
void main()
{
	int i,n,data,ch;
	root=NULL;
	clrscr();
	do
	{
		printf("\nBinary Tree Traversal\n");
		printf("\n1] Enter a node\n2] PreOrder Traversal\n3] InOrder Traversal\n4] PostOrder Traversal\n5] Exit\n");
		printf("\nEnter the choice : ");
		scanf("%d",&ch);
		switch(ch)
		{
			case 1:
			{
				printf("\nEnter Data : ");
				scanf("%d",&data);
				root=insert(root,data);
			}
			break;
			case 2:
			{
				printf("\nPreorder Traversal\n");
				preOrder(root);
				printf("\n");
			}
			break;
			case 3:
			{
				printf("\nPreorder Traversal\n");
				inOrder(root);
				printf("\n");
			}
			break;
			case 4:
			{
				printf("\nPreorder Traversal\n");
				postOrder(root);
				printf("\n");
			}
			break;
			case 5:
			{
				printf("\nExiting.....");
			}
			break;
			default:printf("\nInValid Choice\n");
		}
	}while(ch!=5);
	fflush(stdin);
}