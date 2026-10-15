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
int binarySearch(int a[], int n, int target)
{
    int begin, end, mid;

    begin = 0;
    end = n - 1;

    while (begin <= end)
    {
        mid = (begin + end) / 2;
        if (target > a[mid])
        {
            begin = mid + 1;
        }
        else if (target < a[mid])
        {
            end = mid - 1;
        }
        else
        {
            return mid;
        }
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

    pos = binarySearch(a, n, target);
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