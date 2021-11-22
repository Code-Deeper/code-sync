const allLanguageDefaultCode = {
    cpp: `
#include<iostream>
using namespace std;
int main()
  {
    // Start writing your code from here!
	  cout<<"Welcome to CodeSync!";
	  return 0;
  }
`,
    c: `
#include <stdio.h>
int main()
{
    // Stat writing code from here
	printf("Welcome to CodeSync");

	return 0;
}   
    `,
    java: `
import java.util.*;
class Main
{
    public static void main(String[] args)
    {
        // Start writing code from here :)
        System.out.print("Welcome To CodeSync");
    }
}
    `,
    python: `
# Start writing your code from here
print("Welcome to CodeSync")

    `,
    javascript: `
// Start writing your code from here
console.log("Welcome to CodeSync")
    `
}
export default allLanguageDefaultCode