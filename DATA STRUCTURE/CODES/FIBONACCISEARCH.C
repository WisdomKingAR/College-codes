#include <stdio.h>
#include <conio.h>

#define MAX 100

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

    while (i <= mid)
    {
        b[k] = a[i];
        i++;
        k++;
    }
    while (j <= ub)
    {
        b[k] = a[j];
        j++;
        k++;
    }

    for (p = lb; p <= ub; p++)
    {
        a[p] = b[p];
    }
}

void mergeSort(int a[], int lb, int ub)
{
    int mid;
    if (lb < ub)
    {
        mid = (lb + ub) / 2;
        mergeSort(a, lb, mid);
        mergeSort(a, mid + 1, ub);
        merge(a, lb, mid, ub);
    }
}

/* Returns index of target, or -1 if not found */
int fibonacciSearch(int a[], int n, int target)
{
    int fib2, fib1, fib, offset, i;

    fib2 = 0;          /* F(m-2) */
    fib1 = 1;          /* F(m-1) */
    fib = fib2 + fib1; /* F(m) */

    /* Find the smallest Fibonacci number >= n */
    while (fib < n)
    {
        fib2 = fib1;
        fib1 = fib;
        fib = fib2 + fib1;
    }

    offset = -1;

    while (fib > 1)
    {
        /* Fibonacci-based probe index */
        i = offset + fib2;

        if (i > n - 1)
        {
            i = n - 1;
        }

        if (a[i] == target)
        {
            return i;
        }
        else if (a[i] < target)
        {
            /* Target is in the right part */
            fib = fib1;
            fib1 = fib2;
            fib2 = fib - fib1;
            offset = i;
        }
        else
        {
            /* Target is in the left part */
            fib = fib2;
            fib1 = fib1 - fib2;
            fib2 = fib - fib1;
        }
    }

    /* Check the last remaining element */
    if (fib1 == 1 && offset + 1 <= n - 1 && a[offset + 1] == target)
    {
        return offset + 1;
    }

    return -1;
}

void main()
{
    int a[MAX], n, target, i, pos;

    clrscr();

    printf("Enter the no of elements in the array : ");
    scanf("%d", &n);

    if (n <= 0 || n > MAX)
    {
        printf("Invalid size (must be 1 to %d)", MAX);
        getch();
        return;
    }

    printf("Enter the elements in the array : ");
    for (i = 0; i < n; i++)
    {
        scanf("%d", &a[i]);
    }

    mergeSort(a, 0, n - 1);

    printf("Sorted array : ");
    for (i = 0; i < n; i++)
    {
        printf("%d ", a[i]);
    }
    printf("\n");

    printf("Enter the target element to search : ");
    scanf("%d", &target);

    pos = fibonacciSearch(a, n, target);
    if (pos != -1)
    {
        printf("Target found at index %d (position %d)", pos, pos + 1);
    }
    else
    {
        printf("Target is not present in the list");
    }

    getch();
}