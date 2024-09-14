#include<bits/stdc++.h>
using namespace std;

int main(){
    int t;
    cin>>t;
    while(t--){
        int a,b;
        cin>>a>>b;
        int ans=a,c=a;
        int val=INT_MAX;
        for(int i=a;i<=b;i++){
                if(val > ((i-a)+(b-i))){
                       ans=i;
                       val = (i-a)+(b-i);
                }
        }
        cout<<ans<<'\n';
    }
    return 0;   
}
