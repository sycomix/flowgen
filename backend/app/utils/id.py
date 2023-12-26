import random
import string

def gen_id(length=13):
    # Create a string of all ascii letters and digits
    characters = string.ascii_letters + string.digits
    return ''.join(random.choices(characters, k=length))

# Example usage:
random_string = gen_id()
print(random_string)