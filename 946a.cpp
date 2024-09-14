
#include <iostream>
using namespace std;
int main() {
    int t;
    cin>>t;
    while(t--){
        int x,y;
        cin>>x>>y;
        int s2_c=y/2;
        int s2_r=y%2;
        if(x<((s2_c*7)+(s2_r*11)))
            cout<<s2_c+s2_r<<'\n';
        else{
            int rem=x-((s2_c*7)+(s2_r*11));
            while(rem-15) s2_c++;
            cout<<s2_c+s2_r<<'\n';
        }
    
    }

    return 0;
}
