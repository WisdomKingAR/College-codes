#include <stdio.h>
#include <conio.h>
#define MAX 100
int partition(int a[],int lb,int ub)
{
	int pivot,start,end,temp;
	pivot=a[lb];
	start=lb;
	end=ub;
	while(start<end)
	{
		while(a[start]<=pivot)
		{
			start++;
		}
		while(a[end]>pivot)
		{
			end--;
		}
		if(start<end)
		{
			temp=a[start];
			a[start]=a[end];
			a[end]=temp;
		}
	}
	temp=a[lb];
	a[lb]=a[end];
	a[end]=temp;
	return end;
}
void quicksort(int a[],int lb,int ub)
{
	int loc;
	if(lb<ub)
	{
		loc=partition(a,lb,ub);
		quicksort(a,lb,loc-1);
		quicksort(a,loc+1,ub);
	}
}
int main()
{
	int n,i,a[MAX],lb,ub;
	clrscr();
	printf("Enter the number of element to sort : ");
	scanf("%d",&n);
	if(n>MAX)
	{
		printf("Array size out of bound");
		return 0;
	}
	printf("\nEnter %d elements in array to sort : ",n);
	for(i=0;i<n;i++)
	{
		scanf("%d",&a[i]);
	}
	printf("\nArray before Sorting\n");
	for(i=0;i<n;i++)
	{
		printf("%d\t",a[i]);
	}
	lb=0;
	ub=n-1;
	printf("\nArray after sorting\n");
	quicksort(a,lb,ub);
	for(i=0;i<n;i++)
	{
		printf("%d\t",a[i]);
	}
	getch();
	fflush(stdin);
	return 0;
}