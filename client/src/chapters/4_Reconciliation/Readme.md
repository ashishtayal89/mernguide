# Chapter 4 : Reconciliation

In the previous chapter we learned about how to create the dom in an async manner to prevent the blowing of browser thread. But we still have an issue with it. We are recursively updating the browser dom. This lead to an unpleasant user experience where the user is able to see incomplete UI. Also we are creating a completely new dom tree on every render cycle instead of updating the exiting dom for the newly created/update/deleted elements.

This chapter will include 2 parts :

1. Creating the only once after the creating of complete fiber chain.
2. Updating the dom for re-render using reconciliation.
