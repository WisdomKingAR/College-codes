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
        
    }
}
*/