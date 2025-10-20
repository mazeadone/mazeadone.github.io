import qrcode
# example data
data = "https://gsacm.github.io/Pages/resources.html"
# output file name
filename = "scavengerhunt2.png"
# generate qr code
img = qrcode.make(data)
# save img to a file
img.save(filename)