/*
merge sort uses divide and conquer approach
eg: 7 27 0 -23 1 13 400
here we calculate mid = (lb + up)/2
so group 1 : 7 27 0 -23 (from 0 to mid)
and group 2: 1 13 400 (from mid+1 to ub)
further divide
so group 1.1 : 7 27 group 1.2 : 0 -23 group 2.1 : 1 13 group 2.2 : 400
further divide till we get lb<ub
pseudocode:-
mergesort(A,lb,ub)
{
    if(lb<ub)
    {
    mid = (lb+ub)\2
    mergesort(A,lb,mid)
    mergesort(A,mid+1,ub)
    merge(A,lb,mid,ub)
    }
}
merge(A,lb,mid,ub)
{
    i=lb
    j=mid+1
    k=lb
    while(i<=mid && j<=ub)
    {
        if(a[i]<=a[j])
        {
        b[k]=a[i]
        i++
        }
        else
        {
        b[k]=a[j]
        j++
        }
        k++
    }
    if(i>mid)
    {
        while(j<=ub)
        {
            b[k]=a[j]
            j++
            k++
        }
         for (p = lb; p <= ub; p = p + 1)
        {
            A[p] = B[p]
        }
    }
}
*/

#include <stdio.h>
#include <conio.h>
#define MAX 100

void mergesort(int a[], int lb, int ub)
{
    int mid;
    if (lb < ub)
    {
        mid = (lb + ub) / 2;
        mergesort(a, lb, mid);
        mergesort(a, mid + 1, ub);
        merge(a, lb, mid, ub);
    }
}

void merge(int a[], int lb, int mid, int ub)
{
    int i, j, k, p;
    int b[MAX];

    i = lb;
    j = mid + 1;
    k = lb;

    while (i <= mid && j <= ub)
    {
        if (a[i] <= a[j])
        {
            b[k] = a[i];
            i++;
        }
        else
        {
            b[k] = a[j];
            j++;
        }
        k++;
    }

    if (i > mid)
    {
        while (j <= ub)
        {
            b[k] = a[j];
            j++;
            k++;
        }
    }
    else
    {
        while (i <= mid)
        {
            b[k] = a[i];
            i++;
            k++;
        }
    }

    for (p = lb; p <= ub; p = p + 1)
    {
        a[p] = b[p];
    }
}

int main()
{
    int n, i, a[MAX], lb, ub;
    clrscr();

    printf("Enter the number of elements to sort : ");
    scanf("%d", &n);

    if (n > MAX)
    {
        printf("Array size out of bound");
        return 0;
    }

    printf("\nEnter %d elements in array to sort : ", n);
    for (i = 0; i < n; i++)
    {
        scanf("%d", &a[i]);
    }

    printf("\nArray before Sorting\n");
    for (i = 0; i < n; i++)
    {
        printf("%d\t", a[i]);
    }

    lb = 0;
    ub = n - 1;

    mergesort(a, lb, ub);

    printf("\nArray after Sorting\n");
    for (i = 0; i < n; i++)
    {
        printf("%d\t", a[i]);
    }

    getch();
    fflush(stdin);
    return 0;
}