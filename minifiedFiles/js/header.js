var state_arr=new Array("Mumbai"),s_a=new Array;function print_state(a){var r=document.getElementById(a);r.length=0,r.options[0]=new Option("Select City",""),r.selectedIndex=0;for(var e=0;e<state_arr.length;e++)r.options[r.length]=new Option(state_arr[e],state_arr[e])}function print_city(a,r){var e=document.getElementById(a);e.length=0,e.selectedIndex=0;for(var n=s_a[r].split("|"),i=0;i<n.length;i++)e.options[e.length]=new Option(n[i],n[i])}s_a[0]="",s_a[1]="Andheri(E)|Andheri(W)|Bandra(E)|Bandra(W)|Bhandup|Borivali(E)|Borivali(W)|Breach Candy|Byculla|Colaba|Cuffe Parade|Chembur|Churchgate|Charni Road|Dadar(E)|Dadar(W)|Dahisar|Dharavi|Deonar|Dongri|Elphinstone Road|Flora Fountain|Fort|Girgaum|Grant Road|Goregaon(E)|Goregaon(W)|Ghatkopar(E)|Ghatkopar(W)|Jogeshwari(E)|Jogeshwari(W)|Juhu|Kalbadevi|Kandivali(E)|Kandivali(W)|Khar(E)|Khar(W)|King's Circle|Kurla(E)|Kurla(W)|Lower Parel|Mazgaon|Mahim|Malabar Hill|Matunga|Marine Lines|Malad(E)|Malad(W)|Mulund(E)|Mulund(W)|Nariman Point|Parel|Prabhadevi|Peddar Road|Saki Naka|Santacruz(E)|Santacruz(W)|Sion|Tardeo|Trombay|Versova|Vile Parle(E)|Vile Parle(W)|Vidya Vihar|Vikhroli|Wadala|Worli",print_state("sts");