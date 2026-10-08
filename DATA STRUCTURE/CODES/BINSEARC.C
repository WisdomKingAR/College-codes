#include<stdio.h>
#include<conio.h>
#include<stdlib.h>

struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};

struct Node *root = NULL;
int hgt_left, hgt_right, count = 0;
int mirror = 0;

struct Node* insert(struct Node *r, int value)
{
    count += 1;
    if(r == NULL)
    {
	r = (struct Node*)malloc(sizeof(struct Node));
	r->right = NULL;
	r->left = NULL;
	r->data = value;
    }
    else if(value < r->data)
    {
	r->left = insert(r->left, value);
    }
    else
    {
	r->right = insert(r->right, value);
    }
    return r;
}

void preOrder(struct Node *root)
{
    if(root != NULL)
    {
	printf("%d\t", root->data);
	preOrder(root->left);
	preOrder(root->right);
    }
}

void inOrder(struct Node *root)
{
    if(root != NULL)
    {
	inOrder(root->left);
	printf("%d\t", root->data);
	inOrder(root->right);
    }
}

void postOrder(struct Node *root)
{
    if(root != NULL)
    {
	postOrder(root->left);
	postOrder(root->right);
	printf("%d\t", root->data);
    }
}

int height(struct Node* r)
{
    if(r == NULL)
    {
	return 0;
    }
    hgt_left = height(r->left);
    hgt_right = height(r->right);
    if(hgt_left > hgt_right)
    {
	return(1 + hgt_left);
    }
    else
    {
	return(1 + hgt_right);
    }
}

void mirroring(struct Node* r)
{
    struct Node* temp;
    if(r != NULL)
    {
	mirroring(r->left);
	mirroring(r->right);
	temp = r->left;
	r->left = r->right;
	r->right = temp;
    }
}

struct Node* search(struct Node* r, int key)
{
    if (r == NULL || r->data == key)
	return r;

    if (key < r->data)
	return search(r->left, key);

    return search(r->right, key);
}

void main()
{
    int data, ch, searchKey;
    struct Node* result;
    root = NULL;
    clrscr();

    do {
	printf("\nBinary Tree Traversal & Operations\n");
	printf("\n1] Enter a node\n2] PreOrder Traversal\n3] InOrder Traversal\n4] PostOrder Traversal\n5] Mirror the Tree\n6] Search a Node\n7] Exit\n");
	printf("\nEnter the choice : ");
	scanf("%d", &ch);

	switch(ch)
	{
	    case 1:
	    {
		printf("\nEnter Data : ");
		scanf("%d", &data);
		root = insert(root, data);
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
		printf("\nInOrder Traversal\n");
		inOrder(root);
		printf("\n");
	    }
	    break;
	    case 4:
	    {
		printf("\nPostOrder Traversal\n");
		postOrder(root);
		printf("\n");
	    }
	    break;
	    case 5:
	    {
		mirroring(root);
		mirror = (mirror == 0) ? 1 : 0;
		printf("\nTree successfully mirrored! Current mirror state: %d\n", mirror);
	    }
	    break;
	    case 6:
	    {
		printf("\nEnter element to search : ");
		scanf("%d", &searchKey);

		if (mirror == 1)
		{
		    mirroring(root);
		}

		result = search(root, searchKey);

		if (result != NULL)
		{
		    printf("\nElement %d found in the tree!\n", result->data);
		}
		else
		{
		    printf("\nElement %d not found in the tree.\n", searchKey);
		}

		if (mirror == 1)
		{
		    mirroring(root);
		}
	    }
	    break;
	    case 7:
	    {
		printf("\nExiting.....");
	    }
	    break;
	    default: printf("\nInValid Choice\n");
	}
    } while(ch != 7);

    fflush(stdin);
}
