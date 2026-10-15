#!/usr/bin/env python
# coding: utf-8

# In[2]:


def greet(name):
    return f"Hello,{name}!"


# In[6]:


def add(*args):
    return sum(args)


# In[8]:


def multiply(*args):
    if not args:
        return 0
    result = 1
    for num in args:
        result *= num
    return result


# In[ ]:




