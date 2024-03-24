import csv

def copy_lines(input_file, output_file, num_lines):
    with open(input_file, 'r', newline='') as infile:
        with open(output_file, 'w', newline='') as outfile:
            reader = csv.reader(infile)
            writer = csv.writer(outfile)
            
            # Copy the first num_lines from input_file to output_file
            for _ in range(num_lines):
                try:
                    line = next(reader)
                    writer.writerow(line)
                except StopIteration:
                    break

# Usage
input_file = 'input.csv'
output_file = 'output.csv'
num_lines = 745

copy_lines(input_file, output_file, num_lines)
