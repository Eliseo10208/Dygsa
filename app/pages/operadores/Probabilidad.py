import pandas as pd

ruletaA = [1,2,3,4,5,6,7,8]
dado = [1,2,3,4,5,6]

universo = []
for i in range (0, len(ruletaA)):
    if(ruletaA[i]%2 == 1):
        for j in range (0,len(dado)):
            universo.append(dado[j])
    else:
        universo.append(ruletaA[i])

print(universo)
print("Tamaño del universo: ", len(universo))

posibilidad = [universo[0]]
cantidad = [1]
for i in range(1, len(universo)):
    bandera = True
    for j in range(0, len(posibilidad)):    
        if (universo[i] == posibilidad[j]) :
            cantidad[j] += 1
            bandera = False
            break   
    if (bandera) : 
        posibilidad.append(universo[i])
        cantidad.append(1)

probabilidad = []
for i in range(0, len(cantidad)) :
    probabilidad.append(round((cantidad[i]/len(universo))*100, 1))

data = {
    "Posibilidad" : posibilidad,
    "Probabilidad" : probabilidad,
}

biblioteca = pd.DataFrame(data)
print(biblioteca)

evento1 = 0
for i in range(0, len(posibilidad)) :
    if(posibilidad[i]>6):
        evento1 += probabilidad[i]

index = posibilidad.index(3)
evento2 = probabilidad[index]

index = posibilidad.index(5)
evento3 = probabilidad[index]

print("Mayores a 6 : ", evento1)
print("Numero 3 : ", evento2)
print("Numero 5 : ", evento3)