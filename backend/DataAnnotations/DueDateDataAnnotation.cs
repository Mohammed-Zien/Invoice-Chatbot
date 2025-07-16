using System.ComponentModel.DataAnnotations;

namespace backend.DataAnnotations
{
    public class DueDateDataAnnotation : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        { 
            if ((value is DateOnly dueDate) && value is not null)
            {
                var today = DateOnly.FromDateTime(DateTime.Today);
                if (dueDate < today)
                {
                    return new ValidationResult("Due date must be after today's date.");
                }
            }

            return ValidationResult.Success;
        }
    }
}
